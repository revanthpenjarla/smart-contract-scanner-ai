import sys
import os
import asyncio
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.pipeline import SecurityPipeline

CONTRACTS = {
    "TheDAO.sol": """
pragma solidity ^0.4.8;
contract TheDAO {
    mapping (address => uint) public balances;
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    function withdraw(uint amount) public {
        if (balances[msg.sender] >= amount) {
            msg.sender.call.value(amount)();
            balances[msg.sender] -= amount;
        }
    }
}
""",
    "KingOfTheEther.sol": """
pragma solidity ^0.4.0;
contract KingOfTheEther {
    address public currentMonarch;
    uint public claimPrice;
    
    function KingOfTheEther() {
        currentMonarch = msg.sender;
        claimPrice = 1 ether;
    }
    
    function claimThrone() public payable {
        require(msg.value >= claimPrice);
        
        // VULN: Unchecked / blocking send
        currentMonarch.send(claimPrice);
        
        currentMonarch = msg.sender;
        claimPrice += 1 ether;
    }
}
""",
    "ParityWallet.sol": """
pragma solidity ^0.4.9;
contract WalletLibrary {
    address public owner;
    
    function initWallet(address _owner) public {
        owner = _owner;
    }
    
    function kill(address _to) public {
        require(msg.sender == owner);
        selfdestruct(_to);
    }
}

contract ParityWallet {
    address public walletLibrary;
    
    function ParityWallet(address _walletLibrary) {
        walletLibrary = _walletLibrary;
    }
    
    // Fallback routes to walletLibrary using delegatecall
    function() payable {
        walletLibrary.delegatecall(msg.data);
    }
}
"""
}

async def run_benchmark():
    pipeline = SecurityPipeline()
    print("=============================================================")
    print("       REAL-WORLD EXPLOIT PIPELINE BENCHMARK (MODE C)       ")
    print("=============================================================")
    
    for name, code in CONTRACTS.items():
        start_time = time.time()
        report = await pipeline.scan(code, name, mode="C")
        latency = time.time() - start_time
        
        print(f"\\n--- {name} ---")
        
        # Check if fallback logic triggered (which means 0 initial static findings)
        # We can infer fallback if any finding has category 'semantic-audit' (mapped to whatever the LLM determined)
        # Actually, let's just inspect the findings
        vulns = report.findings
        
        if len(vulns) > 0:
            print(f"Detection Status : PASSED ({len(vulns)} vulnerabilities found)")
            for v in vulns:
                # the semantic fallback overrides v.type based on LLM inference
                print(f" - [{v.severity}] {v.title} (SWC: {v.swcId}) in {v.function}:{v.line}")
                # print(f"   Scenario: {v.attackScenario[:100]}...")
        else:
            print("Detection Status : FAILED (0 vulnerabilities found)")
            
        print(f"Execution Time   : {latency:.2f}s")
        
    print("\\n=============================================================")

if __name__ == "__main__":
    asyncio.run(run_benchmark())
