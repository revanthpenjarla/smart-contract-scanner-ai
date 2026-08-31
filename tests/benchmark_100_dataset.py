import sys
import os
import time
import asyncio
from typing import List, Dict

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.pipeline import SecurityPipeline

# --- 1. Dataset Generation ---

def generate_vulnerable_contract(index: int) -> str:
    return f"""// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract{index} {{
    address public owner;
    mapping(address => uint256) public balances;
    address[] public depositors;

    constructor() {{
        owner = msg.sender;
    }}

    function changeOwner(address newOwner) public {{
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }}

    function withdraw(uint256 amount) public {{
        require(balances[msg.sender] >= amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{{value: amount}}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= amount;
    }}

    function emergencyWithdraw() public {{
        require(tx.origin == owner, "Not authorized");
        payable(msg.sender).transfer(address(this).balance);
    }}

    function destroy() public {{
        selfdestruct(payable(msg.sender));
    }}

    function unsafeWithdraw(uint256 amount) public {{
        unchecked {{
            balances[msg.sender] -= amount;
        }}
        payable(msg.sender).transfer(amount);
    }}

    function distributeRewards(uint256 rewardPerUser) public {{
        for (uint256 i = 0; i < depositors.length; i++) {{
            payable(depositors[i]).transfer(rewardPerUser);
        }}
    }}
}}
"""

def generate_benign_contract(index: int) -> str:
    return f"""// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BenignContract{index} {{
    address public owner;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    constructor() {{
        owner = msg.sender;
    }}

    modifier onlyOwner() {{
        require(msg.sender == owner, "Not owner");
        _;
    }}

    function deposit() public payable {{
        balances[msg.sender] += msg.value;
    }}

    function transfer(address to, uint256 amount) public {{
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }}

    function updateOwner(address newOwner) public onlyOwner {{
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }}
    
    bool private _locked;
    modifier nonReentrant() {{
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }}
    
    function safeWithdraw(uint256 amount) public nonReentrant {{
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{{value: amount}}("");
        require(success, "Transfer failed");
    }}
}}
"""

# --- 2. Benchmark Execution ---

async def run_benchmark():
    print("Generating 100 benchmark contracts...")
    dataset = []
    # 50 vulnerable, 50 benign
    for i in range(50):
        dataset.append((f"VulnerableContract{i}.sol", generate_vulnerable_contract(i), True))
    for i in range(50, 100):
        dataset.append((f"BenignContract{i}.sol", generate_benign_contract(i), False))

    print("Initializing Security Pipeline...")
    pipeline = SecurityPipeline()
    
    print("Running batch analysis across 100 contracts (Mode A: Static)...")
    tp = 0 # Vulnerable contract identified as vulnerable
    fp = 0 # Benign contract identified as vulnerable
    fn = 0 # Vulnerable contract identified as benign
    tn = 0 # Benign contract identified as benign
    
    total_time = 0.0
    
    for filename, code, is_expected_vulnerable in dataset:
        start = time.time()
        report = await pipeline.scan(code, filename, mode="A")
        latency = time.time() - start
        total_time += latency
        
        is_flagged = report.is_vulnerable
        
        if is_expected_vulnerable and is_flagged:
            tp += 1
        elif is_expected_vulnerable and not is_flagged:
            fn += 1
        elif not is_expected_vulnerable and is_flagged:
            fp += 1
            print(f"\\n[!] False Positive in {filename}:")
            for finding in report.findings:
                print(f"  - {finding.function}: {finding.type} at line {finding.line}")
        elif not is_expected_vulnerable and not is_flagged:
            tn += 1

    # --- 3. Metric Calculation ---
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    avg_latency = total_time / 100.0
    
    print("\\n" + "="*50)
    print("BENCHMARK SUMMARY (100 Contracts)")
    print("="*50)
    print(f"True Positives (TP) : {tp}  (Vulnerable flagged correctly)")
    print(f"False Positives (FP): {fp}  (Benign flagged incorrectly)")
    print(f"False Negatives (FN): {fn}  (Vulnerable missed)")
    print(f"True Negatives (TN) : {tn}  (Benign passed correctly)")
    print("-" * 50)
    print(f"Precision           : {precision:.4f} (Target: 1.00)")
    print(f"Recall              : {recall:.4f} (Target: 1.00)")
    print(f"Avg Latency/Contract: {avg_latency:.4f} seconds")
    print("="*50)
    
    # Assert FP = 0 on benign functions as requested
    assert fp == 0, f"Benchmark failed: {fp} false positives detected!"
    print("✅ SUCCESS: 0 False Positives on all benign control contracts!")

if __name__ == "__main__":
    asyncio.run(run_benchmark())
