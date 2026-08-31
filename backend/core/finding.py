from pydantic import BaseModel, Field
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
    snippet: str

class CodeContext(BaseModel):
    contract_name: str
    function_name: str
    function_source: str
    line_start: int
    line_end: int
    modifiers: List[str] = Field(default_factory=list)
    state_variables: List[str] = Field(default_factory=list)
    external_calls: List[str] = Field(default_factory=list)
    surrounding_code: str = ""

class VerifiedVulnerability(BaseModel):
    finding_id: str = Field(..., description="Unique identifier for the finding")
    is_vulnerable: bool = Field(..., description="True if a genuine vulnerability, false if a false positive")
    
    # Unified Schema fields
    type: str = Field(..., description="Vulnerability type/name")
    swcId: str = Field("", description="SWC ID (e.g. SWC-107)")
    cweId: str = Field("", description="CWE ID (e.g. CWE-841)")
    severity: str = Field(..., description="Severity: Critical, High, Medium, Low, Informational")
    confidence: float = Field(..., ge=0.0, le=1.0)
    function: str = Field(..., description="Function name where vulnerability occurs")
    line: int = Field(..., description="Line number of the vulnerability")
    title: str = Field("", description="Human-readable vulnerability title")
    description: str = Field(..., description="Detailed explanation of the vulnerability")
    staticEvidence: str = Field("", description="Evidence from the static analyzer")
    attackScenario: str = Field(..., description="Step by step attack scenario")
    recommendation: str = Field(..., description="Concrete mitigation steps")
    codeSnippet: str = Field("", description="Vulnerable code snippet")
    
    # Internal tracking / fallback fields
    fixed_code: str = Field("", description="Corrected code snippet")
    fallback_used: bool = Field(False)
    fallback_reason: Optional[str] = Field(None)
    model_used: Optional[str] = Field(None)
    raw_response: Optional[str] = Field(None)

class VulnerabilityReportPayload(BaseModel):
    analysis_id: str
    contract_name: str
    timestamp: str
    total_findings: int
    is_vulnerable: bool
    severity_counts: Dict[str, int]
    findings: List[VerifiedVulnerability]
    summary: str
