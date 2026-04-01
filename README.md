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
    RESET_DB=true docker-compose up --build
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
├── frontend/
│   ├── Dockerfile                # Instructions to containerize the React/Vite app
│   ├── index.html                # The HTML entry point (Mounts the React 'root')
│   ├── package.json              # Manifest of dependencies (Vite, React, Zustand, etc.)
│   ├── vite.config.js            # Build configuration and Backend Proxy settings
│   │
│   ├── public/                   # Static assets
│   │   └── logo.svg              # Kether Crown Icon
│   │
│   └── src/
│       ├── main.jsx              # The Bootloader: Mounts the App to the DOM
│       ├── App.jsx               # The Traffic Controller: Handles Auth & Page Routing
│       ├── index.css              # Global Dark-Mode Styles & Variables
│       │
│       ├── components/           # Reusable UI Logic
│       │   ├── ui/               # Atomic Design Components
│       │   │   ├── Input.jsx     # Stylish dark-mode text inputs
│       │   │   ├── Button.jsx    # Primary actions with "loading" states
│       │   │   └── StatusDot.jsx # Small pulsing LEDs (Green/Red/Yellow)
│       │   └── auth/             # Connection-specific UI
│       │       ├── LoginForm.jsx # The "Identity" component (Credentials)
│       │       └── SystemPulse.jsx # The "Environment Check" component (Health)
│       │
│       ├── pages/                # High-level View Containers
│       │   ├── Connection.jsx    # The Login Page (Combines Identity + Env Check)
│       │   ├── Dashboard.jsx     # L1: Project Overview
│       │   ├── Workspace.jsx     # L2-L4: Orchestration & Kanban
│       │   └── Foundry.jsx       # AI Tool Laboratory
│       │
│       ├── hooks/                # Functional Logic (Separated from UI)
│       │   ├── useAuth.js        # Logic for logging in/out & session check
│       │   └── useHealthCheck.js # Logic for pinging the Backend/DB/AI status
│       │
│       └── store/                # Persistent Memory
│           └── authStore.js      # Global state (Zustand: Auth persistence)
│
├── backend/              # FastAPI (Python)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py           # Entry point
│   ├── api/              # Route handlers (v1/projects, v1/tasks)
│   │   ├──  __init__.py
│   │   ├──  auth.py
│   ├── core/             # Auth, Database config, Global constants
│   │   ├──  __init__.py
│   │   ├──  database.py
│   │   ├──  security.py
│   ├── models/           # SQLAlchemy/SQLModel (Database schemas)
│   │   ├──  __init__.py
│   │   ├──  user.py
│   └── services/         # Business logic (The "Orchestrator")
│   │   ├──  __init__.py
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

🛠 The Workspace: Orchestration & Execution
The Workspace is the heart of Kether’s mission control. It provides two distinct lenses through which to view your project: the Project View for high-level architecture and the Backlog View for granular execution. Both views sync to the same underlying data, ensuring that your intent (The "Why") always matches the code (The "How").

1. Project View (The Architectural Blueprint)
This is a graphical, hierarchical map of your project. It is designed to provide the AI with a "Deep Context" of the entire system before a single line of code is written.

Layer 1: Project (The North Star)

Technical DNA: Define the Stack (e.g., FastAPI/React), Architecture (e.g., Microservices), and Coding Standards (e.g., Strict Typing).

UI/UX Signature: Set the design system template (e.g., Kether Dark) and define the primary input/output flows of the entire application.

Layer 2: Functionality (The User Story)

Intent: Formatted as "The user can [Action]" (e.g., The user can register an account).

Metrics: Inherits a Difficulty Score (1–10) and a Completion % calculated from its child tasks.

Layer 3: Functional Task (The Logic Flow)

Behavioral Mapping: Visualizes the logic path: Trigger [Click Sign-in] → Logic [Verify Credentials] → Success [Dashboard].

Success Criteria: Defines the specific state changes expected after execution.

Layer 4: Technical & To-Do Tasks (The Atomic Layer)

Engineering Strategy: Brief "How-to" instructions for the Agent (e.g., Use Argon2 for password hashing).

Checklist: The minimal, non-decomposable units of work that guide the Agent’s step-by-step progress.

🛡️ Cascade Integrity: Kether maintains a strict parent-child relationship. Deleting a parent node triggers an automated recursive cleanup of all nested tasks to prevent "Ghost Context" in the AI's memory.

2. Backlog View (The Execution Factory)
While the Project View focuses on hierarchy, the Backlog View flattens the mission into a high-performance execution grid inspired by tools like Jira and Linear.

Global Filters: Quickly pivot the view by Project, Assigned AI Agent, Priority, or Complexity.

Smart Sorting: Sort by "AI ROI"—identifying functionalities with the highest impact but the lowest technical difficulty.

Status Pipelines: Track every task through its lifecycle: Draft → Ready for Agent → In Foundry → Validating → Done.

Bulk AI Decomposing: Select multiple Functional Tasks and trigger the LLM to auto-generate the Technical and To-Do layers in seconds.

🔄 The Interaction Loop
Draft: Define your Project and Technical DNA in the Project View.

Decompose: Use the AI Decomposer to turn one-sentence Functionalities into full 4-layer trees.

Refine: Graphically reorder the logic flows to match your specific vision.

Execute: Switch to the Backlog to assign tasks to Agents and watch the "Pulse" move from Pending to Done.

---

## The Big Scheme: Kether’s Development Roadmap

### Phase 1: The Infrastructure. 
Setting up the Dockerized environment, the persistent database, and the "Three Tab" skeleton.

### Phase 2: The Data Backbone (Where we are now). 
Defining the SQL schemas for the 4-layer hierarchy (Project → Functionality → Task → Technical Task).

### Phase 3: The Intelligence Layer. 
Connecting the GPT-4o API and building the first "Agent" that can take a Project name and auto-decompose it into Functional Tasks.

### Phase 4: The Foundry. 
Implementing the Python sandbox where the "Toolsmith" agent can write, test, and save new tools.

### Phase 5: Self-Evolution. 
Training Kether to use its own Project Management tab to track its own bugs and feature requests.