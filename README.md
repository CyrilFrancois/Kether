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

---

## Kether File Architecture

.
├── .env                        # Environment variables (DB Credentials, API Keys)
├── docker-compose.yml          # Container orchestration (Backend, Frontend, Postgres)
├── project_structure.txt       # Static reference of the file tree
├── README.md                   # Project documentation and setup guide
├── backend/                    # FastAPI Server Application
│   ├── Dockerfile              # Backend containerization
│   ├── main.py                 # FastAPI entry point & middleware configuration
│   ├── requirements.txt        # Python dependencies (SQLAlchemy, FastAPI, etc.)
│   ├── agents/                 # Internal agent-to-backend communication logic
│   │   ├── executor.py         # Executes sub-tasks based on project constraints
│   │   ├── __init__.py
│   │   └── prompts/
│   │       └── decomposition.txt # Prompt logic to break down projects
│   ├── api/                    # API Endpoints
│   │   ├── attributes.py       # CRUD for dynamic project & Library suggestions
│   │   ├── auth.py             # User authentication and JWT handling
│   │   ├── projects.py         # CRUD for projects (Common + Metadata)
│   │   └── __init__.py
│   ├── core/                   # Security and Config
│   │   ├── security.py         # Password hashing and token validation
│   │   └── __init__.py
│   ├── foundry/                # Logic for the "Foundry" generation engine
│   │   └── __init__.py
│   ├── models/                 # SQLAlchemy Database Schemas
│   │   ├── attribute.py        # Dynamic : key, value, type, project_id
│   │   ├── attributeLibrary.py # Global : track usage freq & domain suggestions
│   │   ├── project.py          # Common : name, domain, favorite, icon
│   │   ├── user.py             # User account structure
│   │   └── __init__.py
│   ├── services/               # Business Logic Layer
│   │   ├── storage_service.py  # Handles project-specific file pathing for assets
│   │   └── __init__.py
│   └── workspace_output/       # Local temp storage for generated code/files
├── foundry/                    # Physical storage for generated "Foundry" artifacts
│   ├── library/                # Saved, validated project templates
│   ├── pending/                # Items currently being generated by agents
│   └── sandbox/                # Testing area for generated code execution
├── frontend/                   # React + Vite Application
│   ├── Dockerfile              # Frontend containerization
│   ├── index.html              # Main HTML entry
│   ├── package.json            # NPM dependencies (Zustand, Lucide, Tailwind)
│   ├── vite.config.js          # Vite build configuration
│   ├── public/                 # Static assets (Favicons, manifest)
│   └── src/                    
│       ├── App.jsx             # Main routing and global layout
│       ├── index.css           # Global Tailwind and custom styles
│       ├── main.jsx            # React DOM rendering
│       ├── components/         
│       │   ├── auth/           
│       │   │   ├── LoginForm.jsx    # User login UI
│       │   │   └── SystemPulse.jsx  # Visual indicator of API/Agent health
│       │   ├── ui/             
│       │   │   ├── AttributeField.jsx # Polymorphic field (Text/List/Toggle)
│       │   │   ├── Button.jsx       # Standardized UI buttons
│       │   │   ├── Input.jsx        # Generic text inputs
│       │   │   ├── ModalChat.jsx    # Mini-chat interface for AI interaction
│       │   │   ├── ProjectCard.jsx  # Summary view of a project
│       │   │   ├── StatusDot.jsx    # Visual state indicator (Active/Archived)
│       │   │   └── UnifiedNodeModal.jsx # Form to add dynamic fields
│       │   └── workspace/      
│       │       ├── BacklogView.jsx      # Task-oriented project view
│       │       ├── FlowerView.jsx       # Visual mapping of project dependencies
│       │       ├── ProjectCard.jsx      # Component for project display in workspace
│       │       ├── ProjectMap.jsx       # High-level architecture visualization
│       │       ├── ProjectMenu.jsx      # Sidebar list with domain icons
│       │       ├── SmartInspector.jsx   # Detail sidebar showing dynamic DNA
│       │       └── TreeView.jsx         # Hierarchical view of project sub-nodes
│       ├── hooks/              
│       │   ├── useAttributes.js     # Logic for fetching DNA suggestions
│       │   ├── useAuth.js           # Auth state logic
│       │   ├── useHealthCheck.js    # Connectivity monitoring
│       │   └── useProjects.js       # CRUD operations for projects
│       ├── pages/              
│       │   ├── Connection.jsx       # Landing/Login page
│       │   ├── Dashboard.jsx        # Overview of all domains/projects
│       │   ├── Foundry.jsx          # AI Generation workspace
│       │   ├── Settings.jsx         # User and App configuration
│       │   └── Workspace.jsx        # Main interactive project environment
│       └── store/              
│           ├── authStore.js         # User state management
│           └── projectStore.js      # Adaptive and UI state
└── database_data/              # Persistent Postgres storage (Volume mapped)
    ├── postgresql.auto.conf
    ├── postgresql.conf         # DB configuration
    ├── postmaster.opts
    └── pgstat.stat             # DB statistics

---

Level 1: The Project (The Core DNA)This is the "Foundry" blueprint. It defines the global constraints that the AI Agent will respect when generating sub-tasks.AttributeDetailPurposeProject IdentityName, Internal Code (e.g., KTH-01), Slug, Version (v1.0.0).Basic identification and URL routing.System Prompt/IntentA high-level vision statement.The "Source of Truth" for the LLM.Technical StackLanguages (Python), Frameworks (FastAPI), DB (Postgres), Hosting (Docker/AWS).Constraints for the Technical Task generator.UI/UX ParadigmStyle (Glassmorphism), Library (Tailwind), Design System (Material).Dictates the "look" of generated frontend tasks.IO SchemaGlobal Input types (User Auth) & Global Output types (JSON API).Defines the project's boundaries.Priority & HealthLow/Med/High/Critical + Project Health Score (calculated).High-level management visibility.Progress Metrics% Completion (Aggregated), Estimated vs. Actual Velocity.Real-time tracking.Repository DNAGitHub/GitLab URL, Main Branch, CI/CD status.Linkage to actual code execution.
Level 2: Functionality (The User Value)Equivalent to an Epic or Feature Set, but focused strictly on Capability.AttributeDetailPurposeUser Story"As a [User], I want to [Action] so that [Value]."Standardized functional intent.Functional SpecDetailed markdown of what the user experiences.Manual or AI-generated documentation.Priority ScoreMoSCoW Method (Must have, Should have, etc.).Scheduling and roadmap planning.Inherited DifficultyTotal complexity sum of all Technical Tasks.Automatically calculated "weight" of the feature.Completion %Ratio of completed Functional Tasks.Granular progress tracking.Dependency MapIDs of other Functionalities required first.Prevents architectural bottlenecks.
Level 3: Functional Task (The Logic Flow)This is the Behavioral Layer. It defines the "Steps" or "States."AttributeDetailPurposeFlow Namee.g., "Success Auth Flow" or "Invalid Password Error."Identifies a specific logic path.State DiagramJSON representation of From-State → To-State.Used for the graphical Workspace map.Input/Output ContractInput Data (Email/Pass) → Output Data (JWT/Error 401).Strictly defines what the code must handle.Pre-conditionsWhat must be true before this task starts (e.g., User is on /login).Validation logic.Post-conditionsWhat must be true after (e.g., Token is stored in LocalStorage).Testing verification.
Level 4: Technical Task (The Implementation)This is where the Developer/Agent works. It translates "Logic" into "Code."AttributeDetailPurposeModule/Pathe.g., backend/api/auth.py or frontend/components/Login.jsx.Where the work happens in the codebase.Complexity (Fibonacci)1, 2, 3, 5, 8, 13 (Story Points).Planning Poker / Velocity calculation.Technical Debt RiskHigh/Med/Low.Flags tasks that might need refactoring later.Agent TypeBackend Agent, Frontend Agent, DevOps Agent.Assigns the task to a specific LLM profile.Code Snippet / Snippet PlaceholderAI-generated boiler-plate code.Direct integration with the "Foundry" tab.Review StatusPending, Approved, Changes Requested.Quality control gate.
Level 5: ToDo (The Atomic Execution)The smallest unit of work. Cannot be broken down further.AttributeDetailPurposeTask Descriptione.g., "Add click event listener to Submit button."Micro-instructions.StatusBacklog, In Progress, Review, Done, Blocked.The "Jira-style" status.AssigneeHuman User or AI Agent Name.Accountability.Time TrackEstimated time vs. Time spent.Calculating real-world velocity.ChecklistSub-steps (e.g., Import Axios, Define URL, Handle Catch).Ensuring nothing is missed.

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

So let's focus on what we gonna have to do. I'm gonna give you the fill structure of Kether, and you gonna list all file we have to CREATE or MODIFY, whats we gonna in it. I wan a summary of what we gonna do and why then, For each operation, i want one compact line with the file name, MODIFY or CREATE, and the objective. 

Here is the current file structure:

--- 

So let's correct those few things one file at a time. Generate the whole file. And below the code to rewrite entierly if needed.
Here the one file with focus on before going to the next:
Here is the code of the existing file to correct/modify:

---

Anything to add or correct? Espicially with the first files and later improvments? List all the modification to be done before trying the new code.

---

So let's correct those few things one file at a time. Generate the whole file. Taking into account the previous files modifications. And below the code to rewrite entierly if needed. And stop with the DNA things, we stay pro on a Porject Management App.
Here the one file with focus on before going to the next: frontend/src/pages/Workspace.jsx

Backend: Database & Core Logic
backend/models/attribute.py | MODIFY | Define the EAV table for dynamic keys, values, and project relationships.
backend/models/attributeLibrary.py | MODIFY | Define global tracking for frequent attributes to power AI suggestions.
backend/models/project.py | MODIFY | Link projects to the new dynamic attributes and remove hardcoded IT fields.
backend/api/attributes.py | MODIFY | Implement endpoints for fetching domain suggestions and saving project DNA.
backend/api/projects.py | MODIFY | Update project creation logic to handle dynamic metadata and domain icons.
backend/main.py | MODIFY | Register the new attributes router to resolve the current 404 errors.
Frontend: UI & State Management
frontend/src/store/projectStore.js | MODIFY | Update state to handle nested attributes and fix the "React child object" error.
frontend/src/hooks/useAttributes.js | MODIFY | Finalize logic to sync local state with the new backend attribute endpoints.
frontend/src/components/ui/UnifiedNodeModal.jsx | MODIFY | Update form submission to send dynamic attribute arrays instead of static fields.
frontend/src/components/workspace/SmartInspector.jsx | MODIFY | Render the dynamic attribute list for the selected project node.
frontend/src/components/ui/AttributeField.jsx | MODIFY | Build a polymorphic input component that switches between text, list, and toggle.
frontend/src/pages/Workspace.jsx | MODIFY | Add error handling to prevent blank pages when API calls fail.

Here is the code of the existing file to correct/modify:

