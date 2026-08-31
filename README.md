# Smart Contract Scanner AI 🔍

An intelligent, AI-assisted smart contract vulnerability scanner that leverages Retrieval-Augmented Generation (RAG) and local Large Language Models (LLMs) to identify, explain, and mitigate security flaws in Solidity code.

## 🚀 Features

* **Multi-Layered Analysis Pipeline**: Combines lightning-fast static AST/Regex analysis with deep semantic AI reasoning.
* **Inverted Gatekeeping**: If the static analyzer misses complex business-logic flaws, the system automatically extracts state-modifying candidate slices and feeds them to the LLM for a mandatory deep semantic audit.
* **100% Local AI**: Designed to run entirely locally using **Ollama** (e.g., `qwen2.5-coder:1.5b`), ensuring absolute privacy for your proprietary smart contracts. Fully GPU-accelerated.
* **RAG-Powered Context**: Dynamically retrieves exact Smart Contract Weakness Classification (SWC) and Common Weakness Enumeration (CWE) definitions to ground the LLM's reasoning and prevent hallucinations.
* **Strict Code-Grounded Output**: The LLM outputs strict JSON mapped to Pydantic schemas, providing exact function traces, bespoke attack scenarios, and tailored fix recommendations.
* **Modern Dashboard**: A responsive React/Vite UI featuring severity badges, Git-style code diff viewers, and real-time background polling.

## 🏗️ Architecture

1. **Frontend**: React + TypeScript + Vite + TailwindCSS.
2. **Backend**: FastAPI + Python + SQLAlchemy (SQLite).
3. **LLM Engine**: Ollama (Local LLM Server).
4. **RAG Knowledge Base**: TF-IDF & Cosine Similarity vector store based on SWC/CWE definitions.

## 🛠️ Installation & Setup

You can run the scanner entirely via Docker (recommended) or natively on your host machine.

### Option A: Fully Dockerized (Recommended)

Requires Docker and Docker Compose. This will spin up the Frontend, Backend, and Ollama in isolated containers.

```bash
# 1. Clone the repository
git clone https://github.com/revanthpenjarla/smart-contract-scanner-ai.git
cd smart-contract-scanner-ai

# 2. Start the Docker stack
docker compose up -d --build

# 3. Pull the local LLM model (First time only)
# Note: If running Ollama inside docker, CPU is used by default.
docker exec -it scanner_ollama ollama run qwen2.5-coder:1.5b
```

Access the UI at: `http://localhost:5173`

*(Note: If you have a GPU on your host and Ollama installed natively, the `docker-compose.yml` is already configured to route `OLLAMA_URL=http://host.docker.internal:11434` to utilize your host GPU. In that case, you do not need the `scanner_ollama` container.)*

### Option B: Native Execution (No Docker)

Requires Node.js (v18+) and Python (3.10+).

```bash
# 1. Start the Backend
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload

# 2. Start the Frontend (in a new terminal)
cd frontend
npm install
npm run dev

# 3. Start Local Ollama (in a new terminal)
ollama run qwen2.5-coder:1.5b
```

## 🛡️ Vulnerability Detection Scope

Currently optimized to detect:
* **Critical**: Missing Access Control, Dangerous Delegatecall, Unprotected Selfdestruct
* **High**: Reentrancy, Authorization via `tx.origin`
* **Medium**: Unchecked Arithmetic, Unbounded Loops, Unchecked Low-Level Calls, Timestamp Dependence, Uninitialized Storage
* **Low**: Missing Zero Address Checks

## 🧪 Testing

The codebase includes comprehensive real-world benchmarks (`tests/benchmark_real_world.py`), validating the pipeline against historical Web3 hacks (The DAO, King of the Ether, Parity Wallet).

## 📄 License

MIT License
