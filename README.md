# Semantic AI Engine & Intelligent Knowledge Base

An enterprise-grade, full-stack RAG (Retrieval-Augmented Generation) application designed for high-performance semantic search and document interaction. This project features a robust **FastAPI** asynchronous backend engine, a modern, type-safe **React + TypeScript** user interface, a multi-layer storage setup (**MySQL, Redis, and Qdrant**), and a rigorous test automation strategy.

---

## 🏗️ Architecture & Component Mapping

```text
┌────────────────────────────────────────────────────────────────────────┐
 │                      REACT + TYPESCRIPT UI FRONTEND                    │
 │  • Chat Interface (Streaming responses)  • Document Management Dashboard│
 └────────────────────────────────────────────────────────────────────────┘
                                     │ (HTTP / SSE / WebSockets)
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                        FASTAPI BACKEND ENGINE                          │
 │  • Async Routers   • Pydantic Schemas   • Depends() Dependency Injection│
 └────────────────────────────────────────────────────────────────────────┘
         │                           │                           │
         ▼                           ▼                           ▼
 ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
 │ REDIS CACHE   │           │ MYSQL RDBMS   │           │ VECTOR DB     │
 │ • Chat Hist.  │           │ • User Auth   │           │ • Embeddings  │
 │ • LLM Caching │           │ • Metadata    │           │ • Document    │
 │ • Rate Limit  │           │ • Audit Logs  │           │   Vectors     │
 └───────────────┘           └───────────────┘           └───────────────┘
                                     ▲                           ▲
                                     │ (Inspections & SQL)       │ (Semantic Query)
                             ┌───────────────┐                   │
                             │ DBEAVER WORK. │ ──────────────────┘
                             └───────────────┘
 ┌────────────────────────────────────────────────────────────────────────┐
 │                           DOCKER ECOSYSTEM                             │
 │ • Containerized services  • Isolated Networks  • Shared Vol. Storage   │
 └────────────────────────────────────────────────────────────────────────┘
```
## 🚀 Key Features

- **Asynchronous RAG Pipeline:** Ingests unformatted text records, creates high-density vectorized representations using OpenAI models (`text-embedding-3-small`), and saves them into Qdrant.
- **Hybrid Data Stratification:** 
  - **Qdrant Vector DB:** Drives localized semantic query processing.
  - **MySQL DB:** Stores configuration metadata, application logs, and structural user audit records.
  - **Redis Cache Layer:** Caches redundant LLM queries to reduce latency and API operational costs while managing request rates.
- **Type-Safe Dynamic UI:** Modern React interface powered by TypeScript and Tailwind CSS to handle real-time streaming chat data components.
- **Enterprise Quality Testing Assurance Framework:** 
  - Backend isolation verification via `pytest` and `pytest-mock`.
  - Python mutation evaluation using `mutmut` to eliminate logical blind spots.
  - Frontend End-to-End Regression coverage using automated **Playwright + Cucumber BDD** syntax maps.
  - Centralized code quality reporting ready for **SonarQube** parsing execution loops.

---

## 📁 System Blueprint & Topology

```text
semantic-ai-engine/
│
├── backend/
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_ai_engine.py      # PyTest Backend Mocks & Integration tests
│   ├── .env                       # Environment Secret Key Bindings
│   ├── Dockerfile                 # Multi-stage Backend Containerization
│   ├── main.py                    # FastAPI Engine & Async Controller Core
│   ├── mutmut-config.py           # Mutation Suite Context Definition
│   └── requirements.txt           # Python Dependency Declarations
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── SemanticChat.tsx   # React Streaming View & Axios Data Layer
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   │   ├── features/
│   │   │   └── semantic_search.feature # Gherkin Functional Specifications
│   │   └── steps/
│   │       └── searchSteps.ts     # Playwright Automation Bindings
│   ├── cucumber.js                # Cucumber System Runner Rules
│   ├── package.json               # Node Package Registries
│   ├── tsconfig.json              # TypeScript Rules Matrix
│   └── vite.config.ts             # Vite Bundler configurations
│
├── docker-compose.yml             # Orchestration for Data Infrastructures
├── run_regression.sh              # CI/CD Quality Pipeline Script Runner
└── sonar-project.properties       # SonarQube Metrics Mapping Specifications
```

---

## 🛠️ Prerequisites

Before launching the system local engine instance vectors, verify your environment contains the following tools:
- **Python** (version `>= 3.11`)
- **Node.js** (version `>= 18.0` / npm package engine)
- **Docker & Docker Compose**
- **An active OpenAI API Token**

---

## ⚡ Setup & Execution Routine

### 1. Boot the Storage Foundations (Docker Layer)
From your root folder directory interface, provision the infrastructure background runtimes:
```bash
docker-compose up -d
```
*Note: This spins up MySQL (`3306`), Redis (`6379`), and Qdrant (`6333`/`6334`). Use tool extensions like DBeaver to inspect schemas locally.*

### 2. Configure Environment Parameters
Create a `.env` parameters profile inside your `backend/` directory setup matching the layout template below:
```env
DATABASE_URL=mysql+aiomysql://ai_user:ai_password@localhost:3306/ai_knowledge
REDIS_URL=redis://localhost:6379/0
VECTOR_DB_URL=http://localhost:6333
OPENAI_API_KEY=your_genuine_openai_key_string
```

### 3. Initialize the FastAPI Engine Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Launch localized hot-reload runner loop
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Access the native interactive OpenAPI specification panel by navigating directly to `http://127.0.0`.

### 4. Initialize the React UI Frontend Engine
Open a new shell session:
```bash
cd frontend
npm install

# Setup local automated headless browser footprint binaries
npx playwright install chromium

# Launch the hot-reloading development server
npm run dev
```
Open your browser of choice to `http://localhost:5173` to test the user interface.

---

## 🧪 Quality Testing Matrix Execution

This application enforces absolute structural confidence via multi-layered deterministic verification cycles.

To run the complete system validation matrix automatically, execute the regression script wrapper at the root directory level:
```bash
chmod +x run_regression.sh
./run_regression.sh
```

### Manual Execution Protocols

#### Backend Isolation Validation & Mutation Testing (Python)
Ensure your python virtual environment is initialized in your current workspace shell window, then run:
```bash
cd backend
# Execute primary mock and unit checks
pytest --cov=. --cov-report=xml:coverage.xml tests/

# Inject code-level semantic structural mutations to confirm assertion logic killing capacity
mutmut run --paths-to-mutate=main.py --runner="pytest"
```

#### Frontend Behavior-Driven Testing Integration (TypeScript + Playwright)
```bash
cd frontend
# Runs Gherkin Feature specifications inside real browser runtimes via Playwright
npx cucumber-js
```

---

## 🛡️ License

This system framework implementation profile is open-source software licensed under the standard [MIT License](LICENSE).
