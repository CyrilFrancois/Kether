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
    docker-compose down -v 
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

# 🏗️ Workspace Module: Functional & UX/UI Specification

The **Workspace** is the primary interactive environment for managing the 5-layer project hierarchy. It serves as a visual Bridge between high-level intent and atomic execution.

---

## 🎨 Layout Architecture

### 1. Project Menu (Left Sidebar)
*   **Purpose:** Global navigation and project switching.
*   **Features:**
    *   **Project List:** Slim cards displaying `Project Name`, `Version`, and a `Health Status` indicator.
    *   **Create Project:** A persistent action item at the top of the list.
    *   **Active Indicator:** Visual highlight on the currently selected project.

### 2. Main Body (The Canvas)
*   **Purpose:** Graphical manipulation of the task hierarchy.
*   **Display Modes:**
    *   **Flower Mode (Centric):** The Project Card sits at the center. Functionalities and tasks radiate outward as nodes. Ideal for brainstorming and non-linear exploration.
    *   **Tree Mode (Hierarchical):** The Project root is on the left. Layers flow horizontally to the right (Project → Functionality → Functional Task → Technical Task → ToDo). Ideal for logic auditing and progress tracking.

### 3. The Smart Inspector (Right Sidebar / Popup)
*   **Purpose:** Deep-dive into card attributes and AI interaction.
*   **Universal Component:** A single "Smart Card" UI that adapts its fields based on the node type (Level 1–5).
*   **AI Sidecar:** 
    *   **Magic Wand Button:** One-click generation of sub-elements or field completion.
    *   **Context Chat:** A focused chat interface to provide specific instructions to the LLM regarding that specific node.

---

## 🧬 The 5-Layer DNA Hierarchy

### Level 1: The Project (Core DNA)
*   **Mandatory:** Name.
*   **Attributes:** System Prompt/Intent, Technical Stack (Languages/DB), UI/UX Paradigm, Repository URL.
*   **Role:** The "Source of Truth" for all underlying AI generations.

### Level 2: Functionality (User Value)
*   **Attributes:** User Story (As a... I want to...), Functional Spec (Markdown), Priority (MoSCoW), Dependency Map.
*   **Role:** Defines a high-level feature or capability.

### Level 3: Functional Task (Logic Flow)
*   **Attributes:** Flow Name, State Diagram (JSON), Input/Output Contract, Pre/Post-conditions.
*   **Role:** Defines the behavioral logic and "states" of a feature.

### Level 4: Technical Task (Implementation)
*   **Attributes:** Module/File Path, Complexity (Fibonacci), Agent Type (Frontend/Backend), Review Status.
*   **Role:** The actual work ticket for the AI Coding Agents.

### Level 5: ToDo (Atomic Execution)
*   **Attributes:** Task Description, Status, Assignee, Time Tracking.
*   **Special Feature:** Can be a "Leaf" connected to any upper level (e.g., a direct link from Project to a ToDo for rapid execution).

---

## 🚀 Key Interaction Workflows

1.  **AI Decomposition:** Users can click a "Decompose" button on a Functional Task to automatically generate the necessary Technical Tasks and ToDos.
2.  **Contextual Chat:** If a user is unsure how to define a Technical Task, they use the internal popup chat to brainstorm with the AI, which then populates the form fields.
3.  **Mode Toggling:** Users can switch between **Flower** and **Tree** views instantly to change their mental model of the project's complexity.

---

tree /f /a | findstr /v /i "node_modules .git __pycache__ kether_db_data pg_ base global 1 2 3 4 5 6000 replorigin_checkpoint mappings snapshots members offsets archive_status 0000" > project_structure.txt

## File Architecture

Kether/
├── .env                        # Environment variables (DB_URL, OPENAI_API_KEY)
├── docker-compose.yml          # Container config (Postgres, FastAPI, Vite)
├── project_structure.txt       # Local export of this tree
├── README.md                   # Project vision and setup instructions
│
├── agents/                     # THE BRAIN: AI logic and prompt engineering
│   ├── executor.py             # Logic for the agent that writes actual code
│   ├── toolsmith.py            # Logic for the agent that creates reusable tools
│   ├── __init__.py             # Makes folder a Python package
│   └── prompts/                # SYSTEM PROMPTS: The "Identity" of each agent
│
├── backend/                    # THE ENGINE: Python/FastAPI Server
│   ├── Dockerfile              # Instructions to containerize the Python backend
│   ├── main.py                 # FastAPI entry point; registers all API routes
│   ├── requirements.txt        # Python dependencies (FastAPI, SQLModel, etc.)
│   ├── agents/                 # Internal helper logic for AI agent calls
│   │   └── __init__.py
│   ├── api/                    # ROUTERS: Endpoint definitions
│   │   ├── auth.py             # Login, Register, and Token Refresh endpoints
│   │   ├── projects.py         # [Phase 2] Tree & Backlog CRUD endpoints
│   │   └── __init__.py
│   ├── core/                   # SHARED: Database & Security config
│   │   ├── database.py         # SQLAlchemy engine and Session generator
│   │   ├── security.py         # JWT Token logic and password hashing
│   │   └── __init__.py
│   ├── foundry/                # Logic for the AI code-generation laboratory
│   │   └── __init__.py
│   ├── models/                 # DATABASE SCHEMAS: SQLModel classes
│   │   ├── project.py          # [Phase 2] The 4-Layer Recursive Schema
│   │   ├── user.py             # User account and auth schemas
│   │   └── __init__.py
│   └── services/               # BUSINESS LOGIC: Complex calculations/ops
│       └── __init__.py
│
├── foundry/                    # THE LAB: Physical storage for AI-generated code
│   ├── library/                # Validated, reusable "Tools" created by agents
│   ├── pending/                # Code generated but not yet human-verified
│   └── sandbox/                # Temp folder for running/testing generated code
│
├── frontend/                   # THE INTERFACE: React + Vite + Tailwind
│   ├── Dockerfile              # Instructions to containerize the React app
│   ├── index.html              # Root HTML entry point
│   ├── package.json            # NPM dependencies (Lucide, Zustand, Tailwind)
│   ├── vite.config.js          # Vite build and proxy settings
│   ├── public/                 # Static assets (logos, icons)
│   └── src/
│       ├── App.jsx             # Main Router and Protected Route logic
│       ├── index.css           # Global CSS and Tailwind directives
│       ├── main.jsx            # React root mount point
│       ├── components/         # REUSABLE UI BLOCKS
│       │   ├── auth/           # Login forms and session pulse indicators
│       │   │   ├── LoginForm.jsx
│       │   │   └── SystemPulse.jsx
│       │   ├── ui/             # "Atoms": Buttons, Inputs, Cards
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── ProjectCard.jsx # The "North Star" DNA summary card
│       │   │   └── StatusDot.jsx
│       │   └── workspace/      # "Molecules": Complex Workspace views
│       │       ├── BacklogView.jsx # Flattened "Ticket" list for execution
│       │       └── ProjectMap.jsx  # Hierarchical "Tree" map of the project
│       │       └── ProjectCard.jsx
│       ├── hooks/              # LOGIC ABSTRACTION
│       │   ├── useAuth.js      # Handles login/logout flows
│       │   ├── useHealthCheck.js # Checks if Backend/DB are online
│       │   └── useProjects.js  # [Phase 2] Syncs Tree/Backlog with API
│       ├── pages/              # FULL PAGE VIEWS
│       │   ├── Connection.jsx  # Login/Signup screen
│       │   ├── Dashboard.jsx   # List of all your projects
│       │   ├── Foundry.jsx     # AI code-gen interface
│       │   ├── Settings.jsx    # User/System preferences
│       │   └── Workspace.jsx   # [Phase 2] Main Map/Backlog controller
│       └── store/              # GLOBAL STATE (Zustand)
│           ├── authStore.js    # User tokens and session state
│           └── projectStore.js # Active project tree and task data
│
└── kether_db_data/             # DATABASE STORAGE: Physical Postgres files
    ├── postgresql.conf         # Main database configuration
    ├── postmaster.pid          # File used to track the running DB process
    └── base/                   # The actual binary data of your tables

---

Level 1: The Project (The Core DNA)This is the "Foundry" blueprint. It defines the global constraints that the AI Agent will respect when generating sub-tasks.AttributeDetailPurposeProject IdentityName, Internal Code (e.g., KTH-01), Slug, Version (v1.0.0).Basic identification and URL routing.System Prompt/IntentA high-level vision statement.The "Source of Truth" for the LLM.Technical StackLanguages (Python), Frameworks (FastAPI), DB (Postgres), Hosting (Docker/AWS).Constraints for the Technical Task generator.UI/UX ParadigmStyle (Glassmorphism), Library (Tailwind), Design System (Material).Dictates the "look" of generated frontend tasks.IO SchemaGlobal Input types (User Auth) & Global Output types (JSON API).Defines the project's boundaries.Priority & HealthLow/Med/High/Critical + Project Health Score (calculated).High-level management visibility.Progress Metrics% Completion (Aggregated), Estimated vs. Actual Velocity.Real-time tracking.Repository DNAGitHub/GitLab URL, Main Branch, CI/CD status.Linkage to actual code execution.Level 2: Functionality (The User Value)Equivalent to an Epic or Feature Set, but focused strictly on Capability.AttributeDetailPurposeUser Story"As a [User], I want to [Action] so that [Value]."Standardized functional intent.Functional SpecDetailed markdown of what the user experiences.Manual or AI-generated documentation.Priority ScoreMoSCoW Method (Must have, Should have, etc.).Scheduling and roadmap planning.Inherited DifficultyTotal complexity sum of all Technical Tasks.Automatically calculated "weight" of the feature.Completion %Ratio of completed Functional Tasks.Granular progress tracking.Dependency MapIDs of other Functionalities required first.Prevents architectural bottlenecks.Level 3: Functional Task (The Logic Flow)This is the Behavioral Layer. It defines the "Steps" or "States."AttributeDetailPurposeFlow Namee.g., "Success Auth Flow" or "Invalid Password Error."Identifies a specific logic path.State DiagramJSON representation of From-State → To-State.Used for the graphical Workspace map.Input/Output ContractInput Data (Email/Pass) → Output Data (JWT/Error 401).Strictly defines what the code must handle.Pre-conditionsWhat must be true before this task starts (e.g., User is on /login).Validation logic.Post-conditionsWhat must be true after (e.g., Token is stored in LocalStorage).Testing verification.Level 4: Technical Task (The Implementation)This is where the Developer/Agent works. It translates "Logic" into "Code."AttributeDetailPurposeModule/Pathe.g., backend/api/auth.py or frontend/components/Login.jsx.Where the work happens in the codebase.Complexity (Fibonacci)1, 2, 3, 5, 8, 13 (Story Points).Planning Poker / Velocity calculation.Technical Debt RiskHigh/Med/Low.Flags tasks that might need refactoring later.Agent TypeBackend Agent, Frontend Agent, DevOps Agent.Assigns the task to a specific LLM profile.Code Snippet / Snippet PlaceholderAI-generated boiler-plate code.Direct integration with the "Foundry" tab.Review StatusPending, Approved, Changes Requested.Quality control gate.Level 5: ToDo (The Atomic Execution)The smallest unit of work. Cannot be broken down further.AttributeDetailPurposeTask Descriptione.g., "Add click event listener to Submit button."Micro-instructions.StatusBacklog, In Progress, Review, Done, Blocked.The "Jira-style" status.AssigneeHuman User or AI Agent Name.Accountability.Time TrackEstimated time vs. Time spent.Calculating real-world velocity.ChecklistSub-steps (e.g., Import Axios, Define URL, Handle Catch).Ensuring nothing is missed.

---

## The Big Scheme: Kether’s Development Roadmap

### Phase 1: The Infrastructure. 
Setting up the Dockerized environment, the persistent database, and the "Three Tab" skeleton.

### Phase 2: The Data Backbone (Where we are now). 
Defining the SQL schemas for the 4-layer hierarchy (Project → Functionality → Functionnal Task → Technical Task → ToDo).

### Phase 3: The Intelligence Layer. 
Connecting the GPT-4o API and building the first "Agent" that can take a Project name and auto-decompose it into Functional Tasks.

### Phase 4: The Foundry. 
Implementing the Python sandbox where the "Toolsmith" agent can write, test, and save new tools.

### Phase 5: Self-Evolution. 
Training Kether to use its own Project Management tab to track its own bugs and feature requests.

### ToDo:
Can you confirm project are linked to a user? And user have rights (modify, comment, just read) and can be share (by user tag or mail or send email to invite)
---

Anything to add or correct? Espicially with the first files and later improvments? List all the modification to be done before trying the new code.


So let's correct those few things, here is what to correct/check. And below the code to rewrite entierly.

---

