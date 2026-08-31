import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from backend.core.finding import StaticFinding, CodeContext, VerifiedVulnerability, VulnerabilityReportPayload
from backend.analyzer.static_analyzer import SolidityStaticAnalyzer
from backend.analyzer.code_extractor import CodeContextExtractor
from backend.rag.knowledge_base import SecurityKnowledgeBase
from backend.rag.retriever import RAGRetriever
from backend.llm.reasoner import LLMReasoner

CATEGORY_TITLES = {
    "reentrancy": "Reentrancy Vulnerability",
    "missing-access-control": "Missing Access Control",
    "tx-origin": "Authorization through tx.origin",
    "unchecked-arithmetic": "Unchecked Arithmetic",
    "unprotected-selfdestruct": "Unprotected Selfdestruct",
    "unbounded-loop": "Unbounded Loop",
    "unchecked-call": "Unchecked Low-Level Call",
    "dangerous-delegatecall": "Dangerous Delegatecall",
    "timestamp-dependence": "Timestamp Dependence",
    "missing-zero-check": "Missing Zero Address Check",
    "uninitialized-storage": "Uninitialized Storage Pointer",
}

CATEGORY_SEVERITY = {
    "missing-access-control": "Critical",
    "reentrancy": "High",
    "tx-origin": "High",
    "unprotected-selfdestruct": "Critical",
    "unchecked-arithmetic": "Medium",
    "unbounded-loop": "Medium",
    "unchecked-call": "Medium",
    "dangerous-delegatecall": "Critical",
    "timestamp-dependence": "Medium",
    "missing-zero-check": "Low",
    "uninitialized-storage": "Medium",
}

CATEGORY_SWC = {
    "missing-access-control": "SWC-105",  # Loose mapping for Unprotected Ether Withdrawal
    "reentrancy": "SWC-107",
    "tx-origin": "SWC-115",
    "unprotected-selfdestruct": "SWC-106",
    "unchecked-arithmetic": "SWC-101",
    "unbounded-loop": "SWC-128", # DoS With Block Gas Limit
    "unchecked-call": "SWC-104",
    "dangerous-delegatecall": "SWC-112",
    "timestamp-dependence": "SWC-116",
    "missing-zero-check": "N/A",
    "uninitialized-storage": "SWC-109"
}

CATEGORY_CWE = {
    "missing-access-control": "CWE-285",
    "reentrancy": "CWE-841", # As requested in example
    "tx-origin": "CWE-362",
    "unprotected-selfdestruct": "CWE-284",
    "unchecked-arithmetic": "CWE-190",
    "unbounded-loop": "CWE-400",
    "unchecked-call": "CWE-252",
    "dangerous-delegatecall": "CWE-829",
    "timestamp-dependence": "CWE-829",
    "missing-zero-check": "N/A",
    "uninitialized-storage": "CWE-456"
}

class SecurityPipeline:
    def __init__(
        self,
        analyzer: Optional[SolidityStaticAnalyzer] = None,
        extractor: Optional[CodeContextExtractor] = None,
        kb: Optional[SecurityKnowledgeBase] = None,
        retriever: Optional[RAGRetriever] = None,
        reasoner: Optional[LLMReasoner] = None
    ):
        self.analyzer = analyzer or SolidityStaticAnalyzer()
        self.extractor = extractor or CodeContextExtractor()
        self.kb = kb or SecurityKnowledgeBase()
        self.retriever = retriever or RAGRetriever(self.kb)
        self.reasoner = reasoner or LLMReasoner()

    async def scan(self, source_code: str, contract_name: Optional[str] = None, mode: str = "C") -> VulnerabilityReportPayload:
        # mode A: static only
        # mode B: static + LLM
        # mode C: static + RAG + LLM
        analysis_id = f"analysis-{uuid.uuid4().hex[:12]}"
        timestamp = datetime.now(timezone.utc).isoformat()
        
        raw_findings = self.analyzer.analyze(source_code, contract_name)
        verified_findings: List[VerifiedVulnerability] = []
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Informational": 0}

        for finding in raw_findings:
            if mode == "A":
                # Static only - bypass LLM completely, just convert to VerifiedVulnerability
                verified = VerifiedVulnerability(
                    finding_id=finding.id,
                    is_vulnerable=True,
                    type=finding.category,
                    severity=CATEGORY_SEVERITY.get(finding.category, "High"),
                    confidence=finding.confidence,
                    function=finding.function,
                    line=finding.line_start,
                    description=f"Static analyzer flag: {finding.message}",
                    attackScenario="N/A",
                    recommendation="N/A",
                    fallback_used=False
                )
            else:
                context = self.extractor.extract(source_code, finding)
                knowledge = None
                if mode == "C":
                    knowledge = self.retriever.retrieve(finding, context, top_k=2)
                
                if isinstance(knowledge, list):
                    kb_text = "\n".join([
                        f"- {entry.get('title', '')}: {entry.get('description', '')}"
                        for entry in knowledge
                    ])
                else:
                    kb_text = knowledge

                verified = await self.reasoner.verify_finding(finding, context, kb_text)
            
            verified.title = CATEGORY_TITLES.get(verified.type, verified.type)
            verified.severity = CATEGORY_SEVERITY.get(verified.type, verified.severity)
            verified.staticEvidence = finding.message
            verified.codeSnippet = finding.snippet
            verified.swcId = CATEGORY_SWC.get(verified.type, "")
            verified.cweId = CATEGORY_CWE.get(verified.type, "")

            if verified.is_vulnerable:
                verified_findings.append(verified)
                sev = verified.severity
                if sev in severity_counts:
                    severity_counts[sev] += 1
                else:
                    severity_counts["Medium"] += 1

        total_vulns = len(verified_findings)
        
        # Inverted Gatekeeping & Semantic Fallback
        if total_vulns == 0 and mode != "A":
            # Extract candidate slices: functions that update state, make external calls, or are payable
            candidate_slices = self.extractor.extract_candidates(source_code)
            
            for candidate in candidate_slices:
                # Mock a static finding to pipe it to the LLM reasoner for semantic audit
                mock_finding = StaticFinding(
                    id=f'finding-{uuid.uuid4().hex[:8]}',
                    contract=candidate.get("contract", contract_name or "Contract"),
                    function=candidate.get("function_name", "unknown"),
                    line_start=candidate.get("line_start", 0),
                    line_end=candidate.get("line_end", 0),
                    category='semantic-audit', # Triggers general semantic review
                    confidence=0.5,
                    message='Candidate function selected for semantic audit.',
                    snippet=candidate.get("header", "")
                )
                
                context = CodeContext(
                    function_name=candidate.get("function_name", "unknown"),
                    function_source=candidate.get("source", ""),
                    contract_state=candidate.get("state", "")
                )
                
                verified = await self.reasoner.verify_finding(mock_finding, context, kb_context="Perform a deep semantic audit for complex logic vulnerabilities (e.g., reentrancy, denial of service, improper authorization) beyond simple regex matches.")
                
                if verified.is_vulnerable:
                    verified.title = CATEGORY_TITLES.get(verified.type, verified.type)
                    verified.severity = CATEGORY_SEVERITY.get(verified.type, verified.severity)
                    verified.staticEvidence = mock_finding.message
                    verified.codeSnippet = verified.codeSnippet or mock_finding.snippet
                    verified.swcId = CATEGORY_SWC.get(verified.type, "")
                    verified.cweId = CATEGORY_CWE.get(verified.type, "")
                    
                    verified_findings.append(verified)
                    sev = verified.severity
                    if sev in severity_counts:
                        severity_counts[sev] += 1
                    else:
                        severity_counts["Medium"] += 1
        
        # Re-evaluate total vulns after semantic fallback
        total_vulns = len(verified_findings)
        is_vuln = total_vulns > 0
        if not is_vuln:
            summary = f"Security analysis completed for '{contract_name or 'Contract'}'. No critical or high-risk vulnerabilities were identified."
        else:
            crit = severity_counts.get("Critical", 0)
            high = severity_counts.get("High", 0)
            med = severity_counts.get("Medium", 0)
            low = severity_counts.get("Low", 0)
            summary = f"Security analysis identified {total_vulns} potential vulnerabilities ({crit} Critical, {high} High, {med} Medium, {low} Low) requiring attention."

        return VulnerabilityReportPayload(
            analysis_id=analysis_id,
            contract_name=contract_name or "Contract.sol",
            timestamp=timestamp,
            total_findings=total_vulns,
            is_vulnerable=is_vuln,
            severity_counts=severity_counts,
            findings=verified_findings,
            summary=summary
        )
