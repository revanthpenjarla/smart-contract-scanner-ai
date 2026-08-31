import json
import os
import logging
import re
from typing import Optional, List, Dict, Any
from pydantic import ValidationError

import httpx
from backend.core.finding import StaticFinding, CodeContext, VerifiedVulnerability

logger = logging.getLogger(__name__)

class LLMReasoner:
    def __init__(self, ollama_url: Optional[str] = None, model: str = "qwen2.5-coder:1.5b", prompt_mode: str = "P1"):
        self.ollama_url = ollama_url or os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = model
        self.prompt_mode = prompt_mode
        self.client = httpx.AsyncClient(base_url=self.ollama_url, timeout=120.0)

    def _compress_code(self, code: str) -> str:
        # Aggressively compress Solidity code by removing comments and extra whitespace
        code = re.sub(r'//.*', '', code)
        code = re.sub(r'/\*[\s\S]*?\*/', '', code)
        code = re.sub(r'\n\s*\n', '\n', code)
        return code.strip()

    async def verify_finding(self, finding: StaticFinding, context: CodeContext, kb_context: Optional[str] = None) -> VerifiedVulnerability:
        schema = VerifiedVulnerability.model_json_schema()
        
        # We only want the LLM to output these exact fields
        fields_to_keep = ["type", "swcId", "cweId", "severity", "confidence", "function", "line", "title", "description", "staticEvidence", "attackScenario", "recommendation", "is_vulnerable"]
        
        # Remove unwanted properties from schema
        properties = schema.get("properties", {})
        schema["properties"] = {k: v for k, v in properties.items() if k in fields_to_keep}
        schema["required"] = [k for k in schema.get("required", []) if k in fields_to_keep]

        compressed_code = self._compress_code(context.function_source)

        prompt_p1 = f"""You are a Solidity auditor. Extract and format the finding. Output strictly valid JSON matching the schema.

STRICT REQUIREMENTS FOR EVERY FINDING:
1. Standards: Identify the Vulnerability name and standard (SWC/CWE) when applicable.
2. Location: State the exact contract, function, and line(s) affected.
3. Grounded Evidence: Quote or identify the specific code pattern causing the issue.
4. Vulnerability Context: Explain why the pattern is vulnerable in this specific contract.
5. Concrete Attack Scenario: Tailored to the actual code. Must include: attacker prerequisites, transaction/function sequence, what the attacker controls, and expected security/accounting impact.
6. Exploitability Assessment: Include exploitability assessment and confidence.
7. Concrete Remediation: Provide specific fix with corrected code/pattern (e.g. Checks-Effects-Interactions, ReentrancyGuard, replacing tx.origin, checking return values).
8. Exploitability Scope: Explain whether the issue is exploitable in the current contract or only a potential weakness.
9. Avoid Duplicates: Group related issues or clearly explain why they are separate.
10. Grounding Rule: The final report must be grounded entirely in the supplied source code. Never invent missing code, attacker capabilities, execution results, or exploit success.

Example TRUE POSITIVE:
Finding: reentrancy at line 24 in withdraw
Code: (bool s,) = msg.sender.call{{value: amt}}(""); balances[msg.sender] -= amt;
Result: {{"is_vulnerable":true,"type":"reentrancy","swcId":"SWC-107","cweId":"CWE-841","severity":"High","confidence":0.95,"function":"withdraw","line":24,"title":"State Modification After External Call (Reentrancy)","description":"The withdraw function sends ETH to msg.sender using low-level call before updating the user balance mapping. This allows reentrancy because the state is not updated prior to handing over control flow.","staticEvidence":"msg.sender.call{{value: amt}}(\"\") at line 24 precedes balances[msg.sender] -= amt at line 26","attackScenario":"Prerequisites: Attacker deploys a malicious contract. Sequence: Attacker calls withdraw(). The raw call triggers the attacker's fallback function, which calls withdraw() again before balances[msg.sender] is decremented. Impact: Repeated withdrawals occur while the balance reflects the original value, allowing the attacker to drain the bank's entire ETH balance. Exploitability: High, directly exploitable.","recommendation":"Follow the Checks-Effects-Interactions pattern: update balances[msg.sender] -= amount before executing the external call, or use a ReentrancyGuard modifier."}}

Now analyze:
Finding: {finding.category} at line {finding.line_start} in {finding.function}
Code:
{compressed_code}

Return ONLY valid JSON matching the schema.
"""
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a smart contract auditor that outputs strictly valid JSON matching the requested schema. Provide grounded, tailored security analysis, avoiding generic statements."},
                {"role": "user", "content": prompt_p1}
            ],
            "format": schema,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "repeat_penalty": 1.2,
                "num_predict": 512
            }
        }

        fallback_reason = ""
        try:
            response = await self.client.post("/api/chat", json=payload)
            response.raise_for_status()
            result_json = response.json()
            raw_content = result_json.get("message", {}).get("content", "")
            
            parsed_data = json.loads(raw_content)
            
            if "confidence" in parsed_data:
                conf = parsed_data["confidence"]
                if isinstance(conf, (int, float)):
                    if conf > 1.0:
                        parsed_data["confidence"] = conf / 100.0

            parsed_data["type"] = finding.category
            parsed_data["fallback_used"] = False
            parsed_data["finding_id"] = finding.id
            parsed_data["model_used"] = self.model
            
            return VerifiedVulnerability(**parsed_data)
            
        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            fallback_reason = f"API/Connection Error: {str(e)}"
            logger.error(f"LLM verification failed ({fallback_reason}), falling back to rule-based expert system.")
        except json.JSONDecodeError as e:
            fallback_reason = f"JSON Parsing Error: {str(e)}"
            logger.error(f"LLM verification failed ({fallback_reason}), falling back to rule-based expert system.")
        except ValidationError as e:
            fallback_reason = f"Pydantic Validation Error: {str(e)}"
            logger.error(f"LLM verification failed ({fallback_reason}), falling back to rule-based expert system.")
        except Exception as e:
            fallback_reason = f"Unexpected Error: {str(e)}"
            logger.error(f"LLM verification failed ({fallback_reason}), falling back to rule-based expert system.")

        return VerifiedVulnerability(
            finding_id=finding.id,
            is_vulnerable=True,
            type=finding.category,
            swcId="N/A",
            cweId="N/A",
            severity="High",
            confidence=finding.confidence,
            function=finding.function,
            line=finding.line_start,
            title=finding.category.replace("-", " ").title(),
            description=f"Potential {finding.category} found in function {finding.function} at line {finding.line_start}. {finding.message}",
            staticEvidence=finding.message,
            attackScenario=f"Prerequisites: Attacker can invoke {finding.function}. Sequence: Attacker triggers the {finding.category} logic at line {finding.line_start}. Impact: Unsafe state modification or access violation specific to {finding.category}. Exploitability: Needs manual confirmation.",
            recommendation=f"Apply standard {finding.category} remediation (e.g. Checks-Effects-Interactions, Access Control, SafeMath/0.8.x) to {finding.function} at line {finding.line_start}.",
            codeSnippet=finding.snippet,
            fallback_used=True,
            fallback_reason=fallback_reason,
            raw_response=None
        )
