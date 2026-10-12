import sys
import os
import json
import time
import asyncio
from pathlib import Path
from typing import List, Dict, Any

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.pipeline import SecurityPipeline, calculate_security_score
from backend.analyzer.static_analyzer import SolidityStaticAnalyzer, CATEGORY_SWC_MAP
from backend.analyzer.code_extractor import CodeContextExtractor
from backend.rag.knowledge_base import SecurityKnowledgeBase
from backend.rag.retriever import RAGRetriever
from backend.llm.reasoner import LLMReasoner, validate_solidity_syntax
from backend.core.integrity import (
    hash_source_sha256,
    hash_source_keccak256,
    compute_finding_hash,
    compute_findings_hash,
    compute_findings_merkle_root,
    compute_report_hash,
)
from backend.core.finding import VerifiedVulnerability

# 40 Diverse Solidity Contracts (Test suite + Real contracts + Held-out evaluation)
TARGET_40_CONTRACTS = [
    # 1-22: Core Test Suite (Covers all SWCs + safe variants + multi-functions + combined)
    "contracts/test_suite/TC1_TxOriginAuth.sol",
    "contracts/test_suite/TC2_TxOriginOwnerChange.sol",
    "contracts/test_suite/TC3_ReentrancyVault.sol",
    "contracts/test_suite/TC3_ReentrancySafe.sol",
    "contracts/test_suite/TC4_DangerousDelegatecall.sol",
    "contracts/test_suite/TC4_SafeDelegatecall.sol",
    "contracts/test_suite/TC6_MissingAccessControl.sol",
    "contracts/test_suite/TC7_UncheckedExternalCall.sol",
    "contracts/test_suite/TC8_TxOriginFalsePositive.sol",
    "contracts/test_suite/TC11_Combined.sol",
    "contracts/test_suite/TC12_CleanContract.sol",
    "contracts/test_suite/TC13_Decoy.sol",
    "contracts/test_suite/TC14_MultiFunction.sol",
    "contracts/test_suite/TC15_Hallucination.sol",
    "contracts/test_suite/TC16_UnprotectedSelfdestruct.sol",
    "contracts/test_suite/TC17_FakeAuthSelfdestruct.sol",
    "contracts/test_suite/TC18_SafeSelfdestruct.sol",
    "contracts/test_suite/TC19_TimestampRandomness.sol",
    "contracts/test_suite/TC20_TimestampEquality.sol",
    "contracts/test_suite/TC21_SafeTimelock.sol",
    "contracts/test_suite/TC22_SafeCheckedCall.sol",
    "contracts/test_suite/TC23_SafeAccessControl.sol",
    # 23-26: Production & Reference Contracts
    "contracts/CleanSafeVault.sol",
    "contracts/ReentrancyVault.sol",
    "contracts/TxOriginWallet.sol",
    "contracts/AuditRegistry.sol",
    # 27-40: Held-Out Benchmark Evaluation Contracts
    "datasets/held_out/Eval_Delegatecall_01.sol",
    "datasets/held_out/Eval_MissingAccessControl_01.sol",
    "datasets/held_out/Eval_Reentrancy_01.sol",
    "datasets/held_out/Eval_Safe_01.sol",
    "datasets/held_out/Eval_Safe_02.sol",
    "datasets/held_out/Eval_Safe_MissingAccessControl_02.sol",
    "datasets/held_out/Eval_Selfdestruct_01.sol",
    "datasets/held_out/Eval_Timestamp_01.sol",
    "datasets/held_out/Eval_TxOrigin_01.sol",
    "datasets/held_out/Eval_UncheckedCall_01.sol",
    "datasets/held_out/Phase4_AccessControl_Vuln_0.sol",
    "datasets/held_out/Phase4_Delegatecall_Vuln_0.sol",
    "datasets/held_out/Phase4_FloatingPragma_Vuln_0.sol",
    "datasets/held_out/Phase4_MultiVuln_0.sol",
]

async def verify_contract(index: int, rel_path: str, pipeline: SecurityPipeline) -> Dict[str, Any]:
    file_path = Path(rel_path)
    if not file_path.exists():
        return {
            "index": index,
            "contract": rel_path,
            "status": "MISSING_FILE",
            "error": f"File not found: {rel_path}"
        }

    source_code = file_path.read_text(encoding="utf-8")
    lines = source_code.splitlines()
    total_lines = len(lines)

    diagnostics = {
        "index": index,
        "contract": file_path.name,
        "path": rel_path,
        "lines_count": total_lines,
        "hidden_issues": [],
        "layers_verified": {},
    }

    # ============================================================
    # LAYER 1: STATIC ANALYZER (AST / REGEX PARSING)
    # ============================================================
    t0 = time.time()
    try:
        raw_findings = pipeline.analyzer.analyze(source_code, file_path.name)
        diagnostics["raw_findings_count"] = len(raw_findings)
        
        # Check for hidden static analysis anomalies:
        for f in raw_findings:
            # Check 1: Out of bounds line numbers
            if f.line_start < 1 or f.line_end > max(1, total_lines) or f.line_start > f.line_end:
                diagnostics["hidden_issues"].append(
                    f"Line number out of bounds in finding {f.id}: start={f.line_start}, end={f.line_end}, total={total_lines}"
                )
            # Check 2: Missing SWC mapping
            if f.category in CATEGORY_SWC_MAP and not f.swc_id:
                diagnostics["hidden_issues"].append(f"Missing swc_id for mapped category: {f.category}")
            # Check 3: Empty snippet
            if not f.snippet or not f.snippet.strip():
                diagnostics["hidden_issues"].append(f"Empty snippet extracted for finding {f.id} ({f.category})")

        diagnostics["layers_verified"]["Analyzer"] = "PASS"
    except Exception as e:
        diagnostics["layers_verified"]["Analyzer"] = f"FAIL: {repr(e)}"
        diagnostics["hidden_issues"].append(f"Static Analyzer crashed: {repr(e)}")
        raw_findings = []

    # ============================================================
    # LAYER 2: CODE CONTEXT EXTRACTOR (SLICING & SCOPE)
    # ============================================================
    try:
        for f in raw_findings:
            ctx = pipeline.extractor.extract(source_code, f)
            if not ctx.function_source or not ctx.function_source.strip():
                diagnostics["hidden_issues"].append(f"CodeExtractor returned empty function_source for {f.function}")
            if ctx.line_start < 1 or ctx.line_end > total_lines:
                diagnostics["hidden_issues"].append(f"CodeExtractor line bounds invalid: [{ctx.line_start}, {ctx.line_end}]")
        diagnostics["layers_verified"]["Extractor"] = "PASS"
    except Exception as e:
        diagnostics["layers_verified"]["Extractor"] = f"FAIL: {repr(e)}"
        diagnostics["hidden_issues"].append(f"CodeExtractor crashed: {repr(e)}")

    # ============================================================
    # LAYER 3: RAG LIBRARIAN (VECTOR / HEURISTIC KNOWLEDGE RETRIEVAL)
    # ============================================================
    try:
        for f in raw_findings:
            ctx = pipeline.extractor.extract(source_code, f)
            knowledge = pipeline.retriever.retrieve(f, ctx, top_k=2)
            if knowledge:
                rag_score, rag_explain = pipeline.retriever.get_explainability_summary(knowledge)
                if rag_score is not None and (rag_score < 0.0 or rag_score > 1.0):
                    diagnostics["hidden_issues"].append(f"RAG similarity score out of range [0, 1]: {rag_score}")
        diagnostics["layers_verified"]["Librarian"] = "PASS"
    except Exception as e:
        diagnostics["layers_verified"]["Librarian"] = f"FAIL: {repr(e)}"
        diagnostics["hidden_issues"].append(f"RAG Librarian crashed: {repr(e)}")

    # ============================================================
    # LAYER 4: FULL PIPELINE EXECUTION (HYBRID MODE C)
    # ============================================================
    try:
        # Run scan in Hybrid mode
        report = await pipeline.scan(source_code, file_path.name, mode="hybrid")
        diagnostics["total_findings"] = report.total_findings
        diagnostics["is_vulnerable"] = report.is_vulnerable
        diagnostics["security_score"] = report.security_score
        diagnostics["risk_level"] = report.risk_level
        diagnostics["report_hash"] = report.report_hash
        diagnostics["merkle_root"] = report.findings_merkle_root

        # Check 4: Security Score bounds
        if report.security_score < 0 or report.security_score > 100:
            diagnostics["hidden_issues"].append(f"Security score out of bounds [0, 100]: {report.security_score}")

        # Check 5: Deterministic Hashes
        if not report.source_hash or len(report.source_hash) != 64:
            diagnostics["hidden_issues"].append(f"Invalid source_hash: {report.source_hash}")
        if not report.report_hash or len(report.report_hash) != 64:
            diagnostics["hidden_issues"].append(f"Invalid report_hash: {report.report_hash}")
        if not report.findings_merkle_root or len(report.findings_merkle_root) != 64:
            diagnostics["hidden_issues"].append(f"Invalid findings_merkle_root: {report.findings_merkle_root}")

        # Check 6: Finding schema completeness & frontend synonym duality
        for vf in report.findings:
            if not vf.vulnerability and not vf.type:
                diagnostics["hidden_issues"].append(f"Finding missing vulnerability/type: {vf.finding_id}")
            if not vf.description and not vf.explanation:
                diagnostics["hidden_issues"].append(f"Finding missing description/explanation: {vf.finding_id}")
            if vf.confidence < 0.0 or vf.confidence > 1.0:
                diagnostics["hidden_issues"].append(f"Finding confidence out of range: {vf.confidence}")

        diagnostics["layers_verified"]["Pipeline"] = "PASS"
    except Exception as e:
        diagnostics["layers_verified"]["Pipeline"] = f"FAIL: {repr(e)}"
        diagnostics["hidden_issues"].append(f"Pipeline crashed during scan: {repr(e)}")

    diagnostics["duration_seconds"] = round(time.time() - t0, 3)
    diagnostics["status"] = "HEALTHY" if not diagnostics["hidden_issues"] else "ANOMALIES_FOUND"
    return diagnostics

async def main():
    print("=" * 75)
    print("🔬 RUNNING COMPREHENSIVE 40-CONTRACT MULTI-AGENT VERIFICATION")
    print("   Skills: subagent-pipeline-verifier + karpathy-guidelines")
    print("=" * 75)

    pipeline = SecurityPipeline()
    results = []
    total_hidden_anomalies = 0

    print(f"Total target contracts to inspect: {len(TARGET_40_CONTRACTS)}\n")

    for idx, path in enumerate(TARGET_40_CONTRACTS, 1):
        print(f"[{idx:02d}/40] Testing '{path}'... ", end="", flush=True)
        res = await verify_contract(idx, path, pipeline)
        results.append(res)
        
        status_icon = "✅" if res["status"] == "HEALTHY" else "⚠️"
        findings_info = f"{res.get('total_findings', 0)} findings | Score: {res.get('security_score', 'N/A')}/100"
        print(f"{status_icon} {res['status']} ({findings_info}) [{res.get('duration_seconds', 0)}s]")
        
        if res["hidden_issues"]:
            total_hidden_anomalies += len(res["hidden_issues"])
            for issue in res["hidden_issues"]:
                print(f"       -> [HIDDEN ISSUE]: {issue}")

    # Output JSON artifact
    out_file = Path("results/forty_contracts_verification_report.json")
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w") as f:
        json.dump(results, f, indent=2)

    print("\n" + "=" * 75)
    print("📊 40-CONTRACT VERIFICATION SUMMARY")
    print("=" * 75)
    healthy_count = sum(1 for r in results if r["status"] == "HEALTHY")
    print(f"Total Contracts Tested : {len(results)}")
    print(f"Healthy (No Anomalies) : {healthy_count} / {len(results)}")
    print(f"Hidden Issues Detected : {total_hidden_anomalies}")
    print(f"Detailed Report Saved  : {out_file}")
    print("=" * 75)

    if total_hidden_anomalies > 0:
        sys.exit(1)
    else:
        print("🎉 ALL 40 CONTRACTS PASSED MULTI-LAYER VERIFICATION WITH 0 HIDDEN ISSUES!")

if __name__ == "__main__":
    asyncio.run(main())
