# Smart Contract Vulnerability Scanner — A-to-Z Agent Implementation Brief

## 0. Mission

Build a **Smart Contract Vulnerability Scanner** for Solidity that is:

- Inspired by the provided IEEE paper on integrating AI/LLMs with blockchain.
- An original implementation focused specifically on smart-contract vulnerability detection.
- Built with a modular architecture so components can be tested and replaced.
- Feasibility-driven rather than technology-driven.
- Implemented using the **Andrej Karpathy coding guidelines as the primary engineering methodology**.
- Built with the existing custom skills:
  1. `andrej-karpathy-skills` — PRIMARY implementation/coding methodology.
  2. `ai-blockchain-reference` — PRIMARY research/paper reference.
  3. `watermelon-ui` — PRIMARY frontend/UI reference.

Do not treat this document as permission to blindly implement every proposed technology. The agent must first understand the existing repository, inspect the available skills, evaluate feasibility, then implement the smallest correct solution.

---

# 1. Existing Custom Skills

The intended local skills directory is:

```text
~/.gemini/config/skills/
```

Expected custom skills:

```text
~/.gemini/config/skills/
├── ai-blockchain-reference/
│   ├── SKILL.md
│   └── references/
│       ├── <paper>.md
│       └── images/
│
├── watermelon-ui/
│   ├── SKILL.md
│   └── references/
│       └── watermelon-ui.md
│
└── andrej-karpathy-skills/
    └── CLAUDE.md
```

The exact filenames inside the skills may differ.

The agent must verify the actual local installation rather than assuming these paths exist.

Suggested verification:

```bash
find ~/.gemini/config/skills -maxdepth 2 -type f -name "SKILL.md" -print
find ~/.gemini/config/skills -maxdepth 2 -type f -name "CLAUDE.md" -print
```

If the Karpathy skill is installed elsewhere, locate it before proceeding.

---

# 2. Skill Priority

Use the three skills deliberately.

## Priority 1 — Andrej Karpathy Coding Guidelines

This is the **primary engineering methodology**.

The agent should follow these principles:

### Think before coding

Before changing code:

- Understand the repository.
- Identify the actual problem.
- Trace the relevant code path.
- Identify existing abstractions.
- Check dependencies.
- Check available tooling.
- Decide the smallest correct change.

Do not immediately start generating files.

### Simplicity first

Prefer:

- Simple architecture.
- Small functions.
- Existing dependencies.
- Existing project patterns.
- Minimal abstractions.
- Easy-to-debug implementations.

Avoid:

- Unnecessary frameworks.
- Premature microservices.
- Unnecessary queues.
- Unnecessary databases.
- Over-engineered abstractions.
- Technology added merely because it sounds advanced.

### Surgical changes

Modify only what is necessary.

Do not:

- Rewrite unrelated files.
- Reformat the entire repository without reason.
- Replace working code unnecessarily.
- Introduce broad architectural changes for a local problem.

### Goal-driven execution

Every implementation step must serve a concrete project requirement.

Before implementation, state internally:

```text
Goal
Current state
Required change
Smallest implementation
Validation
```

The agent should inspect and reason before coding.

---

# 3. Skill Priority 2 — IEEE AI/Blockchain Reference

Use:

```text
ai-blockchain-reference
```

as the main research/reference skill for the project's relationship to the IEEE paper.

Use it when:

- Comparing the architecture with the paper.
- Explaining the research foundation.
- Designing the conceptual layered architecture.
- Writing research/project documentation.
- Checking whether a feature is actually supported by the paper.
- Understanding the AI/LLM/blockchain framing.

Do not claim that implementation-specific technologies came from the paper unless the reference explicitly supports that claim.

The paper is:

> **Integrating Large Language Models and AI Into Blockchain: A Framework for Intelligent Smart Contracts and Fraud Detection**

The paper proposes a layered AI/LLM/blockchain framework involving AI processing, LLM-enhanced decision making, blockchain/smart-contract interaction, data synchronization, and user-facing interaction.

The project is an adaptation/specialization of that conceptual foundation.

---

# 4. Skill Priority 3 — Watermelon UI

Use:

```text
watermelon-ui
```

for React frontend implementation.

Before creating a UI component:

1. Check the Watermelon UI skill.
2. Search for an existing Watermelon component/block.
3. Prefer the official registry.
4. Install only the required component.
5. Reuse/customize components where appropriate.
6. Do not recreate components unnecessarily.

Do not download the complete Watermelon UI library just to use a few components.

Use Watermelon UI for:

- Authentication.
- Dashboard cards.
- Forms.
- Tables.
- Tabs.
- Dialogs.
- Alerts.
- Code display.
- Vulnerability result panels.
- Admin dashboard.
- Filters.
- Navigation.

---

# 5. Project Definition

## One-line definition

> A local AI-assisted Solidity vulnerability scanner where static analysis identifies suspicious code, RAG retrieves relevant security knowledge, and a local LLM verifies and explains the finding, with FastAPI providing orchestration and React + Watermelon UI providing the frontend.

## Core principle

```text
Static Analyzer = "Look here."

RAG = "Here is relevant security knowledge."

LLM = "Is this actually vulnerable, and why?"

FastAPI = "Coordinate everything."

Frontend = "Show the evidence and result."

Admin = "Provide system-wide visibility."
```

---

# 6. Paper vs Original Implementation

The project must clearly distinguish between **research inspiration** and **original engineering implementation**.

## Paper-inspired concepts

The IEEE paper contributes the conceptual foundation for:

- Layered architecture.
- AI processing.
- LLM reasoning/decision making.
- Smart-contract/security context.
- AI-assisted security analysis.
- User interaction.
- Modular system design.
- Data/security considerations.

## Original implementation

This project adds/specializes:

- Solidity-focused vulnerability scanning.
- Static-analysis-first architecture.
- Standard finding schema.
- Code-context extraction.
- RAG security knowledge retrieval.
- Local embedding inference.
- ONNX Runtime evaluation.
- FAISS/Qdrant evaluation.
- Local LLM inference.
- llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression) evaluation.
- Structured vulnerability reports.
- User registration.
- Login.
- Role-based access control.
- User analysis history.
- Admin dashboard.
- System-wide analytics.
- React + Watermelon UI frontend.

Never present the original implementation as if it were directly specified by the IEEE paper.

---

# 7. Refined Architecture

Use this as the **proposed architecture**, but validate every implementation choice.

```text
                         USER
                           │
                           ▼
              ┌────────────────────────┐
              │ Presentation Layer     │
              │ React + Watermelon UI  │
              │                        │
              │ Register / Login       │
              │ User Dashboard         │
              │ Contract Analysis      │
              │ Analysis History       │
              │ Admin Dashboard        │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Application Layer      │
              │ FastAPI                │
              │                        │
              │ Authentication / RBAC  │
              │ Analysis API           │
              │ Orchestration          │
              │ Report Management      │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ AI Processing Layer    │
              │                        │
              │ Solidity Input         │
              │ Static Analyzer        │
              │ Finding Extraction     │
              │ Code Context Extraction│
              │ Embedding Model        │
              │ ONNX Runtime*          │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Knowledge / RAG Layer  │
              │                        │
              │ Security Knowledge Base│
              │ SWC / CWE              │
              │ Solidity Documentation │
              │ Audit Examples         │
              │ Research Material      │
              │ Vector Search*         │
              │ FAISS / Qdrant*        │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ LLM Reasoning Layer    │
              │                        │
              │ Local LLM Runtime*     │
              │ llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression)*             │
              │                        │
              │ Verify finding         │
              │ Explain vulnerability  │
              │ Determine severity     │
              │ Attack scenario        │
              │ Recommend mitigation   │
              │ Generate fixed code    │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Reporting Layer        │
              │                        │
              │ Structured JSON        │
              │ Vulnerability Report   │
              │ Evidence               │
              │ Severity               │
              │ Confidence             │
              │ Recommendations        │
              └───────────┬────────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
          ┌─────────────┐   ┌─────────────┐
          │ User        │   │ Admin       │
          │ Own reports │   │ All users   │
          │ Own history │   │ All reports │
          │ Statistics  │   │ Analytics   │
          └─────────────┘   └─────────────┘
```

`*` = proposed and subject to feasibility validation.

---

# 8. Important Architecture Boundary

Do **not** force the project to reproduce every component of the IEEE paper.

The paper includes broader blockchain functionality such as:

- Blockchain ledger.
- On-chain/off-chain synchronization.
- Merkle-proof synchronization.
- Blockchain execution.
- Proof-of-Authority consensus.
- Smart-contract generation.
- Transaction/fraud analysis.

Those are part of the paper's broader framework.

The current project is primarily a:

> **Solidity vulnerability detection and verification system.**

Therefore, do not automatically add:

- PoA.
- Merkle synchronization.
- Blockchain deployment.
- Transaction execution.
- Smart-contract generation.

Only add them if the project requirements later demonstrate a real need.

---

# 9. Feasibility-First Rule

This is a hard requirement.

Before committing to any major component, evaluate:

- CPU requirements.
- GPU availability/need.
- RAM usage.
- Storage.
- Model size.
- Quantization.
- Inference speed.
- Embedding latency.
- Retrieval latency.
- Static analyzer compatibility.
- Solidity support.
- API integration.
- Database requirements.
- Security implications.
- Development complexity.
- Maintainability.

Do not assume:

```text
Popular technology
=
Best technology
```

Do not assume:

```text
More components
=
Better architecture
```

Do not optimize before identifying an actual bottleneck.

---

# 10. Feasibility Matrix

Create and maintain a matrix like:

| Component | Proposed Technology | Feasible? | Main Concern | Alternative | Decision |
|---|---|---|---|---|---|
| Backend | FastAPI | TBD | Integration/performance | Other Python framework | TBD |
| Static Analysis | TBD | TBD | Accuracy/coverage | Alternative analyzer | TBD |
| Embeddings | Local model | TBD | RAM/quality | Smaller model | TBD |
| Runtime | ONNX Runtime | TBD | Model compatibility | Other runtime | TBD |
| Vector Search | FAISS | TBD | Persistence/filtering | Qdrant | TBD |
| LLM Runtime | llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression) | TBD | RAM/latency | Alternative local runtime | TBD |
| Frontend | React | TBD | Complexity | — | TBD |
| UI | Watermelon UI | TBD | Component availability | Existing shadcn-compatible option | TBD |
| Database | TBD | TBD | History/auth/storage | Alternative DB | TBD |

The agent must not mark something as feasible without either:

- A test, or
- A strong technical justification.

---

# 11. Target Development Philosophy

Follow this cycle for each component:

```text
UNDERSTAND
    ↓
INSPECT
    ↓
PLAN
    ↓
FEASIBILITY CHECK
    ↓
IMPLEMENT SMALLEST VERSION
    ↓
TEST
    ↓
MEASURE
    ↓
KEEP / MODIFY / REMOVE
```

This is the project's primary implementation philosophy.

---

# 12. Core Security Pipeline

The main pipeline is:

```text
Solidity Source
      ↓
Static Analysis
      ↓
Standard Finding Schema
      ↓
Relevant Code Extraction
      ↓
Embedding
      ↓
Vector Retrieval
      ↓
RAG Context
      ↓
LLM Reasoning
      ↓
Structured Output Validation
      ↓
Stored Vulnerability Report
```

Do not reverse the order and use the LLM as the primary scanner unless feasibility testing provides a compelling reason.

---

# 13. Static Analysis

The static analyzer is the first security layer.

Its primary responsibility:

> Find suspicious locations quickly.

It does not need to prove that a vulnerability exists.

Potential categories:

- Reentrancy.
- Integer overflow/underflow.
- Access-control problems.
- Unchecked external calls.
- Dangerous delegatecall.
- Timestamp dependence.
- `tx.origin` usage.
- Denial-of-service patterns.
- Unsafe arithmetic.
- Other Solidity/EVM security patterns.

The exact analyzer must be selected through feasibility and accuracy evaluation.

---

# 14. Finding Schema

Use a stable internal interface:

```json
{
  "id": "finding-001",
  "contract": "Vault.sol",
  "function": "withdraw",
  "line_start": 42,
  "line_end": 47,
  "category": "reentrancy",
  "confidence": 0.71,
  "message": "External call occurs before state update"
}
```

This schema connects:

```text
Static Analyzer
      ↓
Finding
      ↓
Code Extraction
      ↓
RAG
      ↓
LLM
```

Do not let every subsystem invent its own finding format.

---

# 15. Code Extraction

Do not send the entire Solidity contract to the LLM by default.

For each finding, extract as much relevant evidence as necessary:

- Suspicious lines.
- Complete function.
- Relevant modifiers.
- Relevant state variables.
- Related internal functions.
- Relevant inherited functions.
- Relevant surrounding code.
- Relevant external calls.
- Relevant data/control flow context.

Example:

```text
Finding:
Possible reentrancy

Contract:
Vault.sol

Function:
withdraw()

Relevant code:
[function source]

Relevant state:
balances[msg.sender]

Relevant external interaction:
msg.sender.call(...)
```

The extraction system should be expandable if a finding requires more context.

---

# 16. RAG Knowledge Base

Potential sources:

- SWC information.
- CWE information where relevant.
- Solidity security documentation.
- EVM behavior.
- Secure coding practices.
- Vulnerability examples.
- Exploit patterns.
- Mitigation techniques.
- Audit knowledge.
- Verified examples.
- Research papers.
- The IEEE reference material where technically relevant.

The knowledge base should answer:

> What security knowledge is relevant to this specific finding?

RAG must not replace static analysis.

---

# 17. Embedding Layer

Concept:

```text
Finding
Code
Knowledge
Documentation
      ↓
Embedding Model
      ↓
Vector
```

ONNX Runtime is a proposed implementation choice.

Validate:

- Model availability.
- ONNX conversion/compatibility.
- CPU performance.
- RAM usage.
- Embedding quality.
- Solidity retrieval quality.
- Batch behavior.
- Dependency size.

Do not choose a model solely because it is popular.

---

# 18. Vector Retrieval

Initial proposal:

```text
Embedding
   ↓
FAISS
   ↓
Top-K relevant security knowledge
```

Alternative:

```text
Qdrant
```

Use Qdrant only if its capabilities are actually required.

Evaluate:

- Retrieval quality.
- Top-K relevance.
- Filtering.
- Persistence.
- Latency.
- Memory.
- Deployment complexity.
- Scale requirements.

For an initial local prototype, prefer the simplest solution that works.

---

# 19. LLM Reasoning Layer

Proposed runtime:

```text
llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression)
```

The exact runtime/model is not final until feasibility testing.

Input:

1. Static analyzer finding.
2. Relevant Solidity code.
3. Relevant surrounding context.
4. Retrieved vulnerability knowledge.
5. Analysis instructions.

Expected reasoning:

- Is it actually vulnerable?
- What vulnerability category?
- What severity?
- What confidence?
- Why?
- How could it be exploited?
- How should it be mitigated?
- Can corrected code be proposed?

The LLM is a reasoning assistant, not a formal verifier.

---

# 20. Evidence Model

Preserve:

```text
Static Analyzer Evidence
        +
Source Code
        +
Retrieved Knowledge
        +
LLM Reasoning
        =
Auditable Report
```

Important distinction:

```text
Static Finding
      ≠
Confirmed Vulnerability

LLM Confidence
      ≠
Security Proof
```

Reports should make these distinctions clear.

---

# 21. Structured LLM Output

Do not rely on free-form output.

Example:

```json
{
  "is_vulnerable": true,
  "vulnerability": "Reentrancy",
  "severity": "High",
  "confidence": 0.94,
  "affected_lines": [42, 43],
  "explanation": "...",
  "attack_scenario": "...",
  "recommendation": "...",
  "fixed_code": "..."
}
```

FastAPI must validate the result before exposing it to the frontend.

Severity values should eventually be standardized:

```text
Critical
High
Medium
Low
Informational
```

Do not allow arbitrary severity labels if the application expects filtering/statistics.

---

# 22. Authentication

Implement secure account creation and login.

## Registration

Collect:

- Name or username if required.
- Email.
- Password.

Validate:

- Required fields.
- Email format.
- Password requirements.
- Duplicate account handling.

Passwords must be securely hashed.

Never store plaintext passwords.

## Login

Support:

- Email/password.
- Authentication token/session.
- Logout.
- Authentication failure handling.

JWT is a proposed implementation approach only if appropriate to the existing backend.

---

# 23. Role-Based Access Control

Roles:

```text
USER
ADMIN
```

## User permissions

User can:

- Register.
- Login.
- Analyze contracts.
- View own reports.
- View own history.
- View own statistics.

## Admin permissions

Admin can:

- Login.
- View users.
- View all analyses.
- View all reports.
- Filter system activity.
- View system statistics.
- Monitor usage.

Authorization must be enforced by FastAPI/backend.

Frontend route protection alone is insufficient.

---

# 24. Frontend Requirements

## Authentication Screens

- Registration.
- Login.
- Authentication errors.
- Logout.

Use Watermelon UI components wherever available.

## User Dashboard

Show:

- Total analyses.
- Total vulnerabilities.
- Severity distribution.
- Recent analyses.
- Start-analysis action.

## Contract Analysis

Provide:

- Upload Solidity file.
- Paste Solidity source.
- Analyze button.
- Progress state.
- Success state.
- Error state.

## Vulnerability Results

Display:

- Vulnerability.
- Severity.
- Confidence.
- File.
- Function.
- Line numbers.
- Source code.
- Static analyzer evidence.
- Retrieved knowledge.
- LLM explanation.
- Attack scenario.
- Recommended fix.
- Fixed code.

## Analysis History

Provide:

- Previous analyses.
- Date.
- Status.
- Severity.
- Vulnerability count.
- Search/filter.
- Open report.

## Admin Dashboard

Provide:

- Total users.
- Total analyses.
- Total vulnerabilities.
- Severity distribution.
- Vulnerability categories.
- Recent activity.
- User list.
- User-specific analyses.
- Global analysis history.

---

# 25. Watermelon UI Interaction Rules

When implementing a frontend feature:

```text
Requirement
    ↓
Check watermelon-ui skill
    ↓
Check existing registry components
    ↓
Use existing component/block
    ↓
Customize only where required
    ↓
Test
```

Do not build a custom component first and check the skill later.

Do not install the entire registry.

Use the registry pattern documented by the skill.

---

# 26. Backend Responsibilities

FastAPI should coordinate:

- Authentication.
- Authorization.
- User management.
- File uploads.
- Analysis requests.
- Static analysis.
- Finding extraction.
- Code extraction.
- Embeddings.
- RAG retrieval.
- LLM invocation.
- Structured-output validation.
- Persistence.
- Report retrieval.
- User history.
- Admin analytics.

Potential API structure:

```text
/auth/register
/auth/login
/auth/logout

/users/me

/analysis
/analysis/{id}
/analysis/history

/admin/users
/admin/analyses
/admin/statistics
```

Exact endpoints are implementation decisions.

Inspect the existing repository before creating them.

---

# 27. Data Model

At minimum, reason about:

```text
User
Analysis
Finding
VulnerabilityReport
```

Relationship:

```text
User
 └── Analysis
       ├── Findings
       └── Vulnerability Report
```

The database technology is not fixed.

Choose it based on:

- Existing repository.
- Authentication needs.
- Analysis history.
- Admin queries.
- Simplicity.
- Local deployment.
- Resource usage.

Do not introduce a database solely because it is common.

---

# 28. Security Requirements

Treat uploaded Solidity files as untrusted.

Requirements:

- Validate upload type.
- Validate file size.
- Sanitize metadata.
- Do not execute uploaded source as trusted application code.
- Isolate analysis processes where practical.
- Enforce authorization server-side.
- Prevent cross-user data access.
- Keep secrets out of source code.
- Use environment variables/secrets management.
- Validate LLM outputs.
- Apply reasonable resource limits.
- Prevent analysis endpoints from becoming uncontrolled resource-consumption points.

---

# 29. Local/Offline Philosophy

The intended architecture favors local execution where practical:

```text
FastAPI
   ↓
Static Analyzer
   ↓
ONNX Runtime
   ↓
FAISS/Qdrant
   ↓
llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression)
```

Benefits:

- Lower external API dependence.
- Better control over sensitive Solidity source.
- Reproducibility.
- Potentially lower operating cost.

But local execution must not be assumed feasible.

Measure it.

---

# 30. Performance Evaluation

Measure:

- Static-analysis latency.
- Code-extraction latency.
- Embedding latency.
- Retrieval latency.
- LLM inference latency.
- End-to-end analysis time.
- RAM usage.
- CPU usage.
- Storage requirements.
- Accuracy.
- False-positive rate.
- False-negative rate.
- Retrieval relevance.

Do not claim performance improvements without measurements.

---

# 31. Development Order

Use this order unless repository inspection shows a concrete reason to change it.

```text
1. Inspect repository
        ↓
2. Inspect all relevant skills
        ↓
3. Inspect project requirements/reference material
        ↓
4. Establish baseline
        ↓
5. Static analyzer feasibility test
        ↓
6. Standard finding schema
        ↓
7. Code extraction
        ↓
8. Knowledge-base design
        ↓
9. Embedding feasibility test
        ↓
10. ONNX evaluation
        ↓
11. Vector retrieval evaluation
        ↓
12. Local LLM feasibility test
        ↓
13. Structured LLM output
        ↓
14. End-to-end security pipeline
        ↓
15. FastAPI integration
        ↓
16. Database/persistence
        ↓
17. Authentication/RBAC
        ↓
18. React authentication
        ↓
19. User dashboard
        ↓
20. Analysis UI
        ↓
21. Results UI
        ↓
22. History UI
        ↓
23. Admin dashboard
        ↓
24. Full integration testing
        ↓
25. Performance evaluation
        ↓
26. Documentation
```

Do not build the complete frontend before the analysis pipeline works.

The first important milestone is:

```text
Solidity
 ↓
Static Finding
 ↓
Relevant Code
 ↓
RAG
 ↓
LLM
 ↓
Structured Vulnerability JSON
```

Once this is reliable, expose it through FastAPI and build the frontend around the stable API.

---

# 32. Repository-First Rule

Before implementing anything:

1. Inspect the repository structure.
2. Identify frontend/backend directories.
3. Inspect package/dependency files.
4. Inspect existing routes.
5. Inspect existing components.
6. Inspect existing database configuration.
7. Inspect environment configuration.
8. Inspect tests.
9. Inspect README/documentation.
10. Inspect the three skills.

Do not recreate existing functionality.

Do not assume the repository is empty.

---

# 33. Skill Interaction During Implementation

For each major task, identify which skill applies.

Example:

| Task | Primary Skill |
|---|---|
| Architecture/research mapping | `ai-blockchain-reference` |
| Paper claims | `ai-blockchain-reference` |
| Backend implementation | `andrej-karpathy-skills` |
| Static analyzer integration | `andrej-karpathy-skills` |
| RAG implementation | `andrej-karpathy-skills` + reference skill |
| LLM integration | `andrej-karpathy-skills` + reference skill |
| React UI | `watermelon-ui` + `andrej-karpathy-skills` |
| Dashboard components | `watermelon-ui` |
| Authentication UI | `watermelon-ui` |
| Admin UI | `watermelon-ui` |
| Refactoring | `andrej-karpathy-skills` |
| Debugging | `andrej-karpathy-skills` |
| Architecture decisions | `andrej-karpathy-skills` + `ai-blockchain-reference` |

Karpathy remains the primary methodology even when another skill provides domain-specific information.

---

# 34. Agent Decision Procedure

For every non-trivial implementation decision:

```text
1. What is the goal?
2. What currently exists?
3. Which skill applies?
4. What does the reference material actually support?
5. What is the simplest implementation?
6. Is it feasible on the target environment?
7. What dependencies are required?
8. What could fail?
9. How will it be tested?
10. Implement.
11. Test.
12. Measure.
13. Keep, modify, or remove.
```

Do not skip repository inspection.

Do not skip feasibility for major AI components.

---

# 35. Avoid Premature Optimization

Start with the simplest workable architecture.

Initial proposed stack:

```text
Python
FastAPI
Static Analyzer
Local Embedding Model
ONNX Runtime
FAISS
Local LLM
llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression)
React
Watermelon UI
Database
```

But every item is subject to validation.

Do not move to:

- Qdrant,
- distributed workers,
- message queues,
- microservices,
- GPU-specific infrastructure,
- complicated caching,
- complex orchestration,

unless actual requirements or measurements justify them.

---

# 36. Avoid Premature Abstraction

Do not create abstractions such as:

```text
BaseAnalyzerFactory
UniversalModelProvider
AbstractVectorRepository
GenericSecurityPipelineManager
```

unless the repository demonstrates a real need.

Start with concrete, understandable implementations.

Introduce abstractions when there are actual multiple implementations or a tested need for substitution.

---

# 37. Testing Strategy

At minimum, test:

## Authentication

- Registration.
- Duplicate account.
- Invalid credentials.
- Valid login.
- Logout.
- Unauthorized requests.
- User/admin permissions.

## Analysis

- Valid Solidity.
- Invalid Solidity.
- Empty input.
- Oversized input.
- Multiple findings.
- No findings.
- Static analyzer failure.
- Embedding failure.
- Retrieval failure.
- LLM failure.
- Malformed LLM output.

## Authorization

Verify:

```text
User A cannot read User B's analysis.
User cannot access admin endpoints.
Admin can access permitted global data.
```

## Frontend

Test:

- Login.
- Registration.
- Protected routes.
- Upload.
- Analysis progress.
- Results.
- History.
- Admin dashboard.
- Error states.

---

# 38. Failure Handling

The system must not silently fail.

Potential failure points:

```text
Upload
 ↓
Static Analyzer
 ↓
Code Extraction
 ↓
Embedding
 ↓
Vector Search
 ↓
LLM
 ↓
Output Validation
 ↓
Persistence
```

Each stage should produce a meaningful error state.

Do not present an incomplete LLM response as a valid vulnerability report.

---

# 39. Admin Analytics

Admin analytics should be derived from stored analysis records.

Potential metrics:

- Total users.
- Total analyses.
- Total findings.
- Findings by severity.
- Findings by category.
- Analyses over time.
- Recent activity.
- Analysis success/failure rate.

Do not expose sensitive source code unnecessarily in aggregate views.

---

# 40. User Analytics

User-level analytics can include:

- Number of analyses.
- Vulnerability count.
- Severity distribution.
- Recent analysis activity.
- Vulnerability categories.
- Historical trend.

Keep user analytics scoped to that user.

---

# 41. Report Design

A report should clearly separate:

```text
Finding
Evidence
Retrieved Knowledge
LLM Assessment
Severity
Confidence
Attack Scenario
Recommendation
Fixed Code
```

Example:

```text
Confirmed vulnerability

Type:
Reentrancy

Severity:
High

Location:
Vault.sol:42–47

Static evidence:
External call occurs before state update.

LLM assessment:
The contract can be re-entered before the balance is updated.

Recommendation:
Apply checks-effects-interactions or appropriate reentrancy protection.
```

---

# 42. Example End-to-End Flow

Input:

```text
Vault.sol
```

Static analyzer:

```text
Possible reentrancy
Function: withdraw()
Lines: 42–47
```

Extraction:

```text
withdraw()
+
relevant state
+
modifier
+
external call
```

Embedding:

```text
Finding/code → vector
```

Retrieval:

```text
vector
 ↓
FAISS/Qdrant
 ↓
reentrancy knowledge
```

LLM:

```text
finding
+
code
+
retrieved knowledge
 ↓
reasoning
```

Output:

```text
Confirmed vulnerability
Type: Reentrancy
Severity: High
Location: Vault.sol:42–47
Reason: External call occurs before state mutation.
Attack: Attacker may re-enter withdraw before the balance is updated.
Fix: Apply checks-effects-interactions / reentrancy protection.
```

---

# 43. Documentation Requirements

Maintain documentation for:

- Architecture.
- Setup.
- Environment variables.
- Installation.
- API.
- Database.
- Authentication.
- Analysis pipeline.
- RAG pipeline.
- LLM configuration.
- Model requirements.
- Frontend.
- Admin features.
- Testing.
- Performance results.
- Feasibility decisions.
- Known limitations.

Documentation must distinguish:

```text
Implemented
Proposed
Experimental
Not implemented
```

Do not describe experimental components as production-ready.

---

# 44. Research Claims

When discussing the IEEE paper:

- Use the `ai-blockchain-reference` skill.
- Preserve the paper's terminology.
- Do not silently alter its claims.
- Do not attribute project-specific components to the paper.
- Clearly identify adaptations.
- Clearly identify original implementation.

The paper can support the statement that the project is inspired by a layered AI/LLM/blockchain architecture.

It does not automatically support claims that:

- FAISS is required.
- ONNX Runtime is required.
- llama.cpp (integrated with LLMRouter for out-of-token fallback, context-llemur for persistent context memory, and token-optimizer for prompt compression) is required.
- React is required.
- Watermelon UI is required.
- JWT is required.
- The exact static analyzer is required.
- The Admin Dashboard is part of the paper.

Those are implementation decisions.

---

# 45. Definition of Done

The initial complete system is successful when:

```text
User
 ↓
Register
 ↓
Login
 ↓
Upload/paste Solidity
 ↓
Start analysis
 ↓
Static analyzer identifies suspicious code
 ↓
Relevant context extracted
 ↓
Security knowledge retrieved
 ↓
Local LLM evaluates finding
 ↓
Structured report validated
 ↓
Report stored
 ↓
User views report
 ↓
User views history
 ↓
Admin views users
 ↓
Admin views all analyses
 ↓
Admin views system analytics
```

And the system can explain **why** a vulnerability was reported using preserved evidence.

---

# 46. Final Hard Rules for the Agent

1. **Use Andrej Karpathy coding guidelines as the primary engineering methodology.**
2. **Inspect before coding.**
3. **Think before changing architecture.**
4. **Prefer the simplest correct solution.**
5. **Make surgical changes.**
6. **Do not rewrite unrelated code.**
7. **Use `ai-blockchain-reference` for paper/research grounding.**
8. **Use `watermelon-ui` for React UI decisions.**
9. **Do not claim project implementation choices came from the paper unless supported.**
10. **Feasibility-test major AI components.**
11. **Do not assume a local LLM will fit the hardware.**
12. **Do not assume FAISS/Qdrant is necessary before evaluating requirements.**
13. **Do not assume ONNX Runtime is automatically the best embedding runtime.**
14. **Do not make the LLM the only vulnerability detector without justification.**
15. **Keep static analysis and LLM reasoning separate.**
16. **Validate structured LLM output.**
17. **Preserve security evidence.**
18. **Enforce authorization server-side.**
19. **Treat uploaded contracts as untrusted input.**
20. **Do not add blockchain execution, PoA, Merkle synchronization, or transaction processing merely to imitate the paper.**
21. **Do not build the full frontend before the core analysis pipeline is validated.**
22. **Test every major component.**
23. **Measure performance before optimizing.**
24. **Record important feasibility decisions.**
25. **Do not hide failed experiments.**
26. **Do not introduce unnecessary dependencies.**
27. **Do not introduce abstractions without a real need.**
28. **Keep the architecture modular.**
29. **Clearly distinguish implemented, proposed, experimental, and unavailable functionality.**
30. **When uncertain, inspect the repository and relevant skill/reference before deciding.**

---

# 47. Final System Principle

The final architecture should embody:

```text
                    FIND
                     │
                     ▼
              Static Analysis
                     │
                     ▼
                  EXTRACT
                     │
                     ▼
                 RETRIEVE
                     │
                     ▼
                    RAG
                     │
                     ▼
                 REASON
                     │
                     ▼
                 Local LLM
                     │
                     ▼
                  VERIFY
                     │
                     ▼
                  REPORT
                     │
              ┌──────┴──────┐
              ▼             ▼
            USER          ADMIN
```

The research paper supplies the **conceptual AI/LLM architecture**.

The project supplies the **specialized Solidity security pipeline**.

The Karpathy guidelines supply the **engineering discipline**.

The Watermelon skill supplies the **frontend implementation guidance**.

The result should be a feasible, testable, modular implementation rather than a direct copy of the paper.
