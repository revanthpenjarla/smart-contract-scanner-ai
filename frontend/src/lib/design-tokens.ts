/**
 * SMAI Design Tokens & Web3 Security Color Semantics
 * Inspired by Watermelon UI web3-dashboard architecture
 */

export const SEVERITY_TOKENS = {
  Critical: {
    label: 'Critical',
    color: '#ef4444',
    badge: 'bg-red-500/10 text-red-400 border border-red-500/30',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    dot: 'bg-red-500',
    border: 'border-red-500/40',
    bg: 'bg-red-950/20',
  },
  High: {
    label: 'High',
    color: '#f97316',
    badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    glow: 'shadow-[0_0_10px_rgba(249,115,22,0.25)]',
    dot: 'bg-orange-500',
    border: 'border-orange-500/40',
    bg: 'bg-orange-950/20',
  },
  Medium: {
    label: 'Medium',
    color: '#eab308',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    glow: 'shadow-[0_0_8px_rgba(234,179,8,0.2)]',
    dot: 'bg-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/20',
  },
  Low: {
    label: 'Low',
    color: '#38bdf8',
    badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
    glow: 'shadow-[0_0_8px_rgba(56,189,248,0.2)]',
    dot: 'bg-sky-400',
    border: 'border-sky-500/40',
    bg: 'bg-sky-950/20',
  },
  Informational: {
    label: 'Informational',
    color: '#94a3b8',
    badge: 'bg-slate-500/10 text-slate-400 border border-slate-600/30',
    glow: '',
    dot: 'bg-slate-400',
    border: 'border-slate-600/40',
    bg: 'bg-slate-900/30',
  },
} as const;

export type SeverityLevel = keyof typeof SEVERITY_TOKENS;

export const PIPELINE_STEPS = [
  {
    step: 1,
    name: 'Coordinator',
    agent: 'Ingress & Validation Agent',
    desc: 'Ingests Solidity AST, validates RBAC credentials, and schedules async execution',
    icon: '⚡',
    badge: 'text-blue-400 bg-blue-950/40 border border-blue-800/50',
  },
  {
    step: 2,
    name: 'Static Analyzer',
    agent: 'The Analyzer (AST)',
    desc: 'Deep AST walk detects vulnerable control flows and SWC/CWE patterns',
    icon: '🔍',
    badge: 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50',
  },
  {
    step: 3,
    name: 'Context Extractor',
    agent: 'Evidence Slicer',
    desc: 'Isolates function scope, state mutations, and affected bytecode offsets',
    icon: '✂️',
    badge: 'text-purple-400 bg-purple-950/40 border border-purple-800/50',
  },
  {
    step: 4,
    name: 'RAG Knowledge',
    agent: 'The Librarian',
    desc: 'Retrieves verified SWC vectors, audit reports, and EVM mitigation specs',
    icon: '📚',
    badge: 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/50',
  },
  {
    step: 5,
    name: 'LLM Reasoner',
    agent: 'The Skeptic (Reasoner)',
    desc: 'Stress-tests static hypotheses, eliminates false positives, synthesizes fix diff',
    icon: '🛡️',
    badge: 'text-indigo-400 bg-indigo-950/40 border border-indigo-800/50',
  },
] as const;

export const ANALYSIS_MODES = [
  {
    id: 'C',
    name: 'Mode C: Full Multi-Agent RAG',
    shortName: 'Hybrid Multi-Agent',
    tag: 'Recommended',
    tagClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    latency: '~3-5s',
    description:
      'Complete 5-agent pipeline: Static AST detection + RAG SWC mitigation retrieval + Local LLM Skeptic validation with verified fix diff.',
    icon: '🚀',
  },
  {
    id: 'B',
    name: 'Mode B: Static + LLM Reasoning',
    shortName: 'Static + LLM',
    tag: 'Direct Reasoning',
    tagClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    latency: '~2-3s',
    description:
      'AST flags potential vulnerabilities, and the local LLM evaluates exploitability without external RAG knowledge base context.',
    icon: '🤖',
  },
  {
    id: 'A',
    name: 'Mode A: Static AST Only',
    shortName: 'Static AST',
    tag: 'Instant (<100ms)',
    tagClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    latency: '<100ms',
    description:
      'High-speed deterministic AST parser only. Flags rule-based syntactic patterns without calling the local LLM or RAG vector search.',
    icon: '⚡',
  },
] as const;

export type AnalysisModeId = (typeof ANALYSIS_MODES)[number]['id'];

export const EVM_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum Mainnet', symbol: 'ETH', color: 'bg-indigo-500', icon: 'Ξ' },
  { id: 'arbitrum', name: 'Arbitrum One', symbol: 'ARB', color: 'bg-blue-500', icon: 'A' },
  { id: 'polygon', name: 'Polygon PoS', symbol: 'MATIC', color: 'bg-purple-500', icon: 'P' },
  { id: 'optimism', name: 'Optimism Mainnet', symbol: 'OP', color: 'bg-red-500', icon: 'O' },
  { id: 'base', name: 'Base Network', symbol: 'BASE', color: 'bg-blue-600', icon: 'B' },
] as const;

export const CONTRACT_TEMPLATES = [
  {
    id: 'reentrancy',
    name: 'Reentrancy Vault',
    swc: 'SWC-107',
    severity: 'High',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReentrancyVault {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // Vulnerable: state updated after raw external call
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;
    }
}`,
  },
  {
    id: 'access-control',
    name: 'Missing Access Control',
    swc: 'SWC-105',
    severity: 'Critical',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OwnableTreasury {
    address public owner;
    uint256 public treasuryBalance;

    constructor() {
        owner = msg.sender;
    }

    // Vulnerable: missing onlyOwner modifier allowing anyone to withdraw
    function drainTreasury(address payable recipient) external {
        recipient.transfer(address(this).balance);
    }

    function setOwner(address newOwner) external {
        owner = newOwner;
    }
}`,
  },
  {
    id: 'tx-origin',
    name: 'tx.origin Authorization',
    swc: 'SWC-115',
    severity: 'High',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TxOriginWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Vulnerable: tx.origin can be spoofed via phishing contract
    function transferOwnership(address newOwner) external {
        require(tx.origin == owner, "Not authorized");
        owner = newOwner;
    }

    function withdrawAll(address payable recipient) external {
        require(tx.origin == owner, "Not authorized");
        recipient.transfer(address(this).balance);
    }
}`,
  },
  {
    id: 'selfdestruct',
    name: 'Unprotected Selfdestruct',
    swc: 'SWC-106',
    severity: 'Critical',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableDestroy {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // Vulnerable: no access control on selfdestruct
    function kill() external {
        selfdestruct(payable(msg.sender));
    }
}`,
  },
  {
    id: 'unchecked-call',
    name: 'Unchecked Low-Level Call',
    swc: 'SWC-104',
    severity: 'Medium',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UncheckedCaller {
    mapping(address => uint256) public rewards;

    // Vulnerable: return value of call not checked
    function claimReward(address payable target) external {
        uint256 amount = rewards[msg.sender];
        rewards[msg.sender] = 0;
        target.call{value: amount}("");
    }
}`,
  },
  {
    id: 'safe-contract',
    name: 'Secure Token Bank',
    swc: 'Passed',
    severity: 'Clean',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecureVault {
    mapping(address => uint256) private _balances;
    bool private _locked;

    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    function deposit() external payable {
        _balances[msg.sender] += msg.value;
    }

    // Secure: Checks-Effects-Interactions pattern adhered to
    function withdraw(uint256 amount) external nonReentrant {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getBalance(address account) external view returns (uint256) {
        return _balances[account];
    }
}`,
  },
] as const;

export function calculateSecurityScore(counts?: Record<string, number>): {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  color: string;
  label: string;
} {
  if (!counts) {
    return { score: 100, grade: 'A+', color: '#10b981', label: 'Clean Contract' };
  }

  const crit = counts.Critical || 0;
  const high = counts.High || 0;
  const med = counts.Medium || 0;
  const low = counts.Low || 0;

  // Deductions: Critical: -40, High: -25, Med: -10, Low: -4
  const deductions = crit * 40 + high * 25 + med * 10 + low * 4;
  const score = Math.max(0, 100 - deductions);

  if (crit > 0 || score < 50) {
    return { score, grade: 'F', color: '#ef4444', label: 'Critical Risk' };
  }
  if (high > 0 || score < 70) {
    return { score, grade: 'C', color: '#f97316', label: 'Elevated Risk' };
  }
  if (med > 0 || score < 85) {
    return { score, grade: 'B', color: '#eab308', label: 'Moderate Risk' };
  }
  if (score < 98) {
    return { score, grade: 'A', color: '#38bdf8', label: 'Minor Issues' };
  }
  return { score: 100, grade: 'A+', color: '#10b981', label: 'Passed / Clean' };
}
