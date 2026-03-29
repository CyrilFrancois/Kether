# 👑 Kether
**The Autonomous Project Orchestrator**

Kether is an AI-native project management engine designed for 2026. Unlike traditional tools that simply store tasks, Kether is an **Active Agent Engine**. It bridges the gap between a "To-Do" list and actual code execution by allowing AI agents to understand, decompose, and solve technical problems autonomously.

---

## 🚀 The Vision
Kether (Hebrew for *Crown*) represents the source of intent. The goal is to move from **Manual Management** to **Autonomous Delivery**.

* **Hierarchical Context:** AI agents understand the "Why" (Project) before executing the "How" (Technical Task).
* **The Foundry:** A dedicated space where a "Toolsmith" AI agent builds, tests, and validates the Python tools needed to solve specific tickets.
* **On-Prem Sovereignty:** Run everything locally using Docker. Your data stays in your volumes; your intelligence comes from your GPT keys.

---

## 🛠 Project Architecture
Kether is built as a containerized stack to ensure environment parity and data persistence.

* **Frontend:** React / Next.js (Single Page Application).
* **Backend:** Python (FastAPI) — The Agent Coordinator & Logic Layer.
* **Database:** PostgreSQL 16 (Persistent via Docker Volumes).
* **Agent Sandbox:** Isolated environment for running AI-generated Python scripts.
* **Intelligence:** OpenAI GPT-4o / GPT-4-turbo (via API Key).

---

## 📂 Mission Hierarchy
Kether organizes work through four recursive layers to provide maximum context to the AI:

1.  **Project:** The North Star (e.g., *Personal Portfolio*).
2.  **Functionality:** Major feature blocks (e.g., *User Authentication*).
3.  **Functional Task:** User-facing requirements (e.g., *Allow password resets*).
4.  **Technical Task:** The code-level mission (e.g., *Update SMTP transport layer*).

---

## 💻 Technical Setup (Local Dev)

### Prerequisites
* Docker & Docker Compose
* An OpenAI API Key

### Quick Start
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/kether.git](https://github.com/your-username/kether.git)
    cd kether
    ```

2.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    GPT_KEY=your_openai_api_key_here
    POSTGRES_PASSWORD=kether_dev_pass
    DB_URL=postgresql://postgres:kether_dev_pass@db:5432/kether
    ```

3.  **Launch the Stack:**
    ```bash
    docker-compose up --build
    ```
    * **Frontend:** `http://localhost:3000`
    * **Backend API:** `http://localhost:8000/docs`
    * **Database:** Port `5432` (Data persisted in `./kether_db_data`)

---

## 🏗 The Three Tabs

### 1. Dashboard Overview
A high-level "Command & Control" view. Monitor the **Agent Pulse**, see which agents are currently coding, and track the advancement of every project at a glance.

### 2. Workspace (PM)
The interactive board for managing the 4-layer hierarchy.
* **Nested Cards:** Visual representation of how subtasks relate to parent functionalities.
* **Smart Attributes:** Cards include AI-calculated difficulty (1-10), priority, and custom tags.
* **AI Decomposition:** One-click decomposition of a "Functional Task" into granular "Technical Tasks."

### 3. The Foundry
The AI's laboratory. 
* **Tool Library:** View available Python tools (Scrapers, Test Runners, File Writers).
* **Toolsmith Agent:** Create a ticket to build a *new* tool. The AI writes the code and runs it in a sandbox.
* **Validation:** Review and approve AI-generated tools before they are promoted to the main library.

---

## 🛡 Security & Persistence
* **Data Persistence:** All database states are stored in the `./kether_db_data` volume. Your project history survives reboots.
* **The Sandbox:** AI-generated code is executed in restricted environments to prevent accidental modifications to the host system.

---

## File Architecture

Kether/
├── .env                  # Secrets (GPT_KEY, DB_PASS) - DO NOT COMMIT
├── .gitignore            # Standard ignores + kether_db_data/
├── docker-compose.yml    # Orchestrates the whole stack
├── README.md             # The file we just created
├── kether_db_data/       # [LOCAL ONLY] Persistent Postgres data (auto-created)
│
├── frontend
    ├── src/
        ├── main.jsx              # The Bootloader (Already created)
        ├── App.jsx               # The Router (New: Switches between Login and Dashboard)
        │
        ├── components/           # Reusable UI
        │   ├── ui/
        │   │   ├── Input.jsx     # Stylish dark-mode text inputs
        │   │   ├── Button.jsx    # Primary actions with "loading" states
        │   │   └── StatusDot.jsx # Small pulsing LEDs (Green/Red/Yellow)
        │   └── auth/
        │       ├── LoginForm.jsx # The "Identity" component
        │       └── SystemPulse.jsx # The "Environment Check" component
        │
        ├── pages/
        │   ├── Connection.jsx    # The full Login Page (Combines Identity + Env Check)
        │   ├── Dashboard.jsx
        │   ├── Workspace.jsx
        │   └── Foundry.jsx
        │
        ├── hooks/
        │   ├── useAuth.js        # Logic for logging in/out
        │   └── useHealthCheck.js # Logic for pinging the Backend/DB/AI status
        │
        └── store/
            └── authStore.js      # Global state (Is user logged in? What is their name?)
│
├── backend/              # FastAPI (Python)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py           # Entry point
│   ├── api/              # Route handlers (v1/projects, v1/tasks)
│   ├── core/             # Auth, Database config, Global constants
│   ├── models/           # SQLAlchemy/SQLModel (Database schemas)
│   └── services/         # Business logic (The "Orchestrator")
│
├── agents/               # The AI Intelligence Layer
│   ├── __init__.py
│   ├── base_agent.py     # Base class for all agents
│   ├── toolsmith.py      # The agent that creates tools
│   ├── executor.py       # The agent that solves technical tasks
│   └── prompts/          # System prompts for different layers
│
└── foundry/              # The "Lab" for AI-generated tools
    ├── library/          # Approved Python tools (e.g., git_tool.py)
    ├── pending/          # Tools waiting for user validation
    └── sandbox/          # Temporary folder for AI code execution

---

## The Big Scheme: Kether’s Development Roadmap

### Phase 1: The Infrastructure (Where we are now). 
Setting up the Dockerized environment, the persistent database, and the "Three Tab" skeleton.

### Phase 2: The Data Backbone. 
Defining the SQL schemas for the 4-layer hierarchy (Project → Functionality → Task → Technical Task).

### Phase 3: The Intelligence Layer. 
Connecting the GPT-4o API and building the first "Agent" that can take a Project name and auto-decompose it into Functional Tasks.

### Phase 4: The Foundry. 
Implementing the Python sandbox where the "Toolsmith" agent can write, test, and save new tools.

### Phase 5: Self-Evolution. 
Training Kether to use its own Project Management tab to track its own bugs and feature requests.