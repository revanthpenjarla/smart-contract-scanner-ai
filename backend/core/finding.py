from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any

class StaticFinding(BaseModel):
    id: str
    contract: str
    function: str
    line_start: int
    line_end: int
    category: str
    confidence: float
    message: str
    snippet: str = ""
    severity: Optional[str] = "High"
    swc_id: Optional[str] = None

class CodeContext(BaseModel):
    contract_name: str
    function_name: str
    function_source: str
    line_start: int
    line_end: int
    modifiers: List[str] = Field(default_factory=list)
    state_variables: List[str] = Field(default_factory=list)
    external_calls: List[str] = Field(default_factory=list)
    candidate_slices: List[str] = Field(default_factory=list)
    surrounding_code: str = ""

class VerifiedVulnerability(BaseModel):
    finding_id: str = Field(..., description="Unique identifier for the finding")
    is_vulnerable: bool = Field(..., description="True if a genuine vulnerability, false if a false positive")
    
    # Unified Schema fields
    type: str = Field(default="", description="Vulnerability type/name")
    swcId: str = Field("", description="SWC ID (e.g. SWC-107)")
    cweId: str = Field("", description="CWE ID (e.g. CWE-841)")
    severity: str = Field(..., description="Severity: Critical, High, Medium, Low, Informational")
    confidence: float = Field(..., ge=0.0, le=1.0)
    function: str = Field(default="", description="Function name where vulnerability occurs")
    line: int = Field(default=1, description="Line number of the vulnerability")
    title: str = Field("", description="Human-readable vulnerability title")
    description: str = Field(default="", description="Detailed explanation of the vulnerability")
    staticEvidence: str = Field("", description="Evidence from the static analyzer")
    attackScenario: str = Field(default="", description="Step by step attack scenario")
    recommendation: str = Field(default="", description="Concrete mitigation steps")
    codeSnippet: str = Field("", description="Vulnerable code snippet")

    @model_validator(mode='before')
    @classmethod
    def populate_synonyms(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # type <-> vulnerability
            if 'vulnerability' in data and not data.get('type'):
                data['type'] = data['vulnerability']
            elif 'type' in data and not data.get('vulnerability'):
                data['vulnerability'] = data['type']

            # title
            if not data.get('title'):
                data['title'] = data.get('vulnerability') or data.get('type') or ''

            # function
            if not data.get('function'):
                data['function'] = 'unknown'

            # line <-> affected_lines
            if 'affected_lines' in data and not data.get('line'):
                data['line'] = data['affected_lines'][0] if data['affected_lines'] else 1
            elif 'line' in data and not data.get('affected_lines'):
                data['affected_lines'] = [data['line']]

            # description <-> explanation
            if 'explanation' in data and not data.get('description'):
                data['description'] = data['explanation']
            elif 'description' in data and not data.get('explanation'):
                data['explanation'] = data['description']

            # attackScenario <-> attack_scenario
            if 'attack_scenario' in data and not data.get('attackScenario'):
                data['attackScenario'] = data['attack_scenario']
            elif 'attackScenario' in data and not data.get('attack_scenario'):
                data['attack_scenario'] = data['attackScenario']

            # codeSnippet <-> original_code
            if 'original_code' in data and not data.get('codeSnippet'):
                data['codeSnippet'] = data['original_code']
            elif 'codeSnippet' in data and not data.get('original_code'):
                data['original_code'] = data['codeSnippet']

            # staticEvidence <-> static_evidence
            if 'static_evidence' in data and not data.get('staticEvidence'):
                data['staticEvidence'] = data['static_evidence']
            elif 'staticEvidence' in data and not data.get('static_evidence'):
                data['static_evidence'] = data['staticEvidence']

            # swcId <-> swc_id
            if 'swc_id' in data and not data.get('swcId'):
                data['swcId'] = data['swc_id'] or ''
            elif 'swcId' in data and not data.get('swc_id'):
                data['swc_id'] = data['swcId'] or None
        return data
    
    # Internal tracking / fallback fields
    fixed_code: str = Field("", description="Corrected code snippet")
    fallback_used: bool = Field(False)
    fallback_reason: Optional[str] = Field(None)
    model_used: Optional[str] = Field(None)
    raw_response: Optional[str] = Field(None)

    # Presentation / UI & Blockchain integrity fields
    verification_status: str = Field("CONFIRMED", description="CONFIRMED, REJECTED, or UNVERIFIED")
    vulnerability: Optional[str] = Field(None, description="Vulnerability classification")
    attack_scenario: Optional[str] = Field(None, description="Attack scenario")
    static_evidence: Optional[str] = Field(None, description="Static evidence")
    original_code: Optional[str] = Field(None, description="Original code snippet")
    affected_lines: List[int] = Field(default_factory=list, description="Affected lines")
    explanation: Optional[str] = Field(None, description="Vulnerability explanation")
    contract: Optional[str] = Field(None, description="Contract name")
    swc_id: Optional[str] = Field(None, description="SWC identifier")
    fix_verified: Optional[bool] = Field(None, description="True if rescanning fixed code confirms fix")
    fix_verification_reason: Optional[str] = Field(None, description="Reason for fix verification result")
    retrieved_knowledge: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    rag_similarity_score: Optional[float] = Field(None)
    rag_explanation: Optional[str] = Field(None)
    finding_hash: Optional[str] = Field(None, description="Deterministic cryptographic hash of the finding")
    verifier_source: Optional[str] = Field(None, description="Verification engine: AI, Static AST, or Fallback")

    def model_post_init(self, __context: Any) -> None:
        if not self.vulnerability:
            self.vulnerability = self.title or (self.type.replace("-", " ").title() if self.type else "")
        if not self.attack_scenario:
            self.attack_scenario = self.attackScenario
        if not self.static_evidence:
            self.static_evidence = self.staticEvidence
        if not self.original_code:
            self.original_code = self.codeSnippet
        if not self.affected_lines and self.line:
            self.affected_lines = [self.line]
        if not self.explanation:
            self.explanation = self.description
        if not self.swc_id and self.swcId:
            self.swc_id = self.swcId

class VulnerabilityReportPayload(BaseModel):
    analysis_id: str
    contract_name: str
    timestamp: str
    total_findings: int
    is_vulnerable: bool
    severity_counts: Dict[str, int]
    findings: List[VerifiedVulnerability]
    summary: str
    mode: str = "C"
    security_score: Optional[int] = Field(None, description="Security score from 0 to 100")
    risk_level: Optional[str] = Field(None, description="Risk level rating based on security score")
    source_code: Optional[str] = Field(None, description="Original Solidity source code")
    source_hash: Optional[str] = Field(None, description="SHA-256 hash of submitted Solidity source code")
    source_keccak256: Optional[str] = Field(None, description="Keccak-256 hash of submitted Solidity source code")
    report_hash: Optional[str] = Field(None, description="Deterministic canonical hash of the analysis report")
    findings_hash: Optional[str] = Field(None, description="Deterministic hash of canonical findings")
    findings_merkle_root: Optional[str] = Field(None, description="Merkle root of canonical finding hashes")
    analyzer_version: Optional[str] = Field(None, description="Version of the static analyzer / engine")
    analysis_timestamp: Optional[str] = Field(None, description="ISO-8601 analysis execution timestamp")
    model_used: Optional[str] = Field(None, description="LLM model used for verification")
    analysis_mode: Optional[str] = Field(None, description="Analysis mode: rag, ai, or hybrid")
    rag_version: Optional[str] = Field(None, description="RAG security knowledge base version or digest")
    compiler_version: Optional[str] = Field(None, description="Solidity compiler version / pragma extracted from source")
    git_commit: Optional[str] = Field(None, description="Git commit hash of SMAI platform build if available")
    user_id: Optional[str] = Field(None, description="ID of user or auditor requesting the analysis")
    audit_id: Optional[str] = Field(None, description="On-chain audit registry ID")
    tx_hash: Optional[str] = Field(None, description="On-chain registration transaction hash")
    registry_address: Optional[str] = Field(None, description="Audit registry contract address")
    chain_id: Optional[int] = Field(None, description="EVM chain ID")
    on_chain_status: Optional[str] = Field(None, description="Status on blockchain")
    raw_findings_count: int = 0
    ai_confirmed_count: int = 0
    ai_rejected_count: int = 0
    suppressed_findings: List[VerifiedVulnerability] = Field(default_factory=list)
