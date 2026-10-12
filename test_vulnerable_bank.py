import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.pipeline import SecurityPipeline
from backend.core.finding import VulnerabilityReportPayload

async def main():
    print("Loading pipeline...")
    pipeline = SecurityPipeline()

    print("Reading VulnerableBank.sol...")
    with open("contracts/VulnerableBank.sol") as f:
        source_code = f.read()

    print("Running end-to-end scan (Mode B: Static + LLM)...")
    report: VulnerabilityReportPayload = await pipeline.scan(
        source_code=source_code,
        contract_name="VulnerableBank.sol",
        mode="B"
    )

    print("\n=== SCAN RESULTS ===")
    print(f"Is Vulnerable: {report.is_vulnerable}")
    print(f"Total Findings: {report.total_findings}")
    print(f"Severity Counts: {report.severity_counts}")
    
    expected_categories = {
        "missing-access-control",
        "reentrancy",
        "tx-origin",
        "unchecked-arithmetic",
        "unprotected-selfdestruct",
        "unbounded-loop"
    }
    
    found_categories = set()

    for i, f in enumerate(report.findings):
        print(f"\nFinding #{i+1}:")
        print(f"  Title: {f.title}")
        print(f"  Type: {f.type}")
        print(f"  Severity: {f.severity}")
        print(f"  Confidence: {f.confidence}")
        print(f"  Fallback Used: {f.fallback_used}")
        print(f"  Model Used: {f.model_used}")
        print(f"  Function: {f.function}")
        print(f"  Line: {f.line}")
        found_categories.add(f.type)

    missing = expected_categories - found_categories
    if missing:
        print(f"\n❌ FAILED: Missing expected vulnerabilities: {missing}")
        sys.exit(1)
        
    print("\n✅ SUCCESS: All expected vulnerabilities detected by pipeline!")

if __name__ == "__main__":
    asyncio.run(main())
