// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    address public owner;
    mapping(address => uint256) public balances;
    address[] public depositors;

    constructor() {
        owner = msg.sender;
    }

    // SAFE: Standard payable deposit - must NOT be flagged
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        depositors.push(msg.sender);
    }

    // VULN 1: Reentrancy - external call before state update (~line 21-28)
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= amount;
    }

    // VULN 2: Missing Access Control - no onlyOwner modifier (~line 30-33)
    function changeOwner(address newOwner) public {
        owner = newOwner;
    }

    // VULN 3: tx.origin authentication (~line 35-39)
    function emergencyWithdraw() public {
        require(tx.origin == owner, "Not authorized");
        payable(msg.sender).transfer(address(this).balance);
    }

    // VULN 4: Unchecked arithmetic in unchecked block (~line 41-47)
    function unsafeWithdraw(uint256 amount) public {
        unchecked {
            balances[msg.sender] -= amount;
        }
        payable(msg.sender).transfer(amount);
    }

    // VULN 5: Unprotected selfdestruct (~line 49-52)
    function destroy() public {
        selfdestruct(payable(msg.sender));
    }

    // VULN 6: Unbounded loop over dynamic array (~line 54-60)
    function distributeRewards(uint256 rewardPerUser) public {
        for (uint256 i = 0; i < depositors.length; i++) {
            payable(depositors[i]).transfer(rewardPerUser);
        }
    }

    receive() external payable {}
}
