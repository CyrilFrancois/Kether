from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

# --- LAYER 1: PROJECT (The North Star / System Blueprint) ---
class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    
    # Technical & UI DNA
    tech_stack: Optional[str] = Field(default="Python, React")
    repo_url: Optional[str] = None
    ui_paradigm: Optional[str] = Field(default="Modern/Dark") # Glassmorphism, Material, etc.
    io_schema: Optional[str] = Field(default="REST API")      # JSON, GraphQL, Webhooks
    
    # Management & Style
    priority: str = Field(default="Medium") # Low, Medium, High
    visibility: str = Field(default="Private") # Private, Team
    color: str = Field(default="#3498db")
    
    # Metadata & Progress
    progress: float = Field(default=0.0) # Calculated aggregate
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Identity Link
    user_id: int = Field(foreign_key="user.id")
    
    # Relationships
    functionalities: List["Functionality"] = Relationship(
        back_populates="project", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 2: FUNCTIONALITY (The User Story / Epic) ---
class Functionality(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str # e.g., "User Auth System"
    user_story: Optional[str] = None # "As a [User], I want to..."
    functional_spec: Optional[str] = None # Detailed markdown
    
    priority_level: str = Field(default="Should Have") # MoSCoW: Must, Should, Could, Won't
    completion_pct: float = Field(default=0.0)
    
    project_id: int = Field(foreign_key="project.id")
    project: Project = Relationship(back_populates="functionalities")
    
    functional_tasks: List["FunctionalTask"] = Relationship(
        back_populates="functionality",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 3: FUNCTIONAL TASK (The Logic Flow / State) ---
class FunctionalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    flow_name: str # e.g., "Login Success Flow"
    
    # State Logic
    pre_conditions: Optional[str] = None # "User on /login"
    post_conditions: Optional[str] = None # "JWT in LocalStorage"
    input_contract: Optional[str] = None # JSON schema of inputs
    output_contract: Optional[str] = None # JSON schema of outputs
    
    functionality_id: int = Field(foreign_key="functionality.id")
    functionality: Functionality = Relationship(back_populates="functional_tasks")
    
    technical_tasks: List["TechnicalTask"] = Relationship(
        back_populates="functional_task",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 4: TECHNICAL TASK (The Engineering Layer) ---
class TechnicalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str # e.g., "Implement JWT Middleware"
    module_path: Optional[str] = None # e.g., "backend/auth/security.py"
    
    # Execution DNA
    agent_type: str = Field(default="Backend") # Backend, Frontend, DevOps
    strategy_prompt: Optional[str] = None # Specialized instructions for LLM
    
    # Metrics
    status: str = Field(default="backlog") # backlog, in_progress, review, done
    complexity: int = Field(default=3) # Fibonacci: 1, 2, 3, 5, 8, 13
    risk_level: str = Field(default="Low")
    
    functional_task_id: int = Field(foreign_key="functionaltask.id")
    functional_task: FunctionalTask = Relationship(back_populates="technical_tasks")
    
    # Level 5: Atomic To-Dos
    # Stored as a simple list of objects in JSON: [{"task": "...", "done": false}]
    todo_items: Optional[str] = Field(default="[]")