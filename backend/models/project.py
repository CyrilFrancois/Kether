from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

# --- LAYER 1: PROJECT (The North Star / System Blueprint) ---
class Project(SQLModel, table=True):
    __tablename__: str = "projects" # Explicitly naming for clarity

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    
    # Technical & UI DNA
    tech_stack: Optional[str] = Field(default="Python, React")
    repo_url: Optional[str] = None
    ui_paradigm: Optional[str] = Field(default="Modern/Dark") 
    io_schema: Optional[str] = Field(default="REST API")      
    
    # Management & Style
    priority: str = Field(default="Medium") 
    visibility: str = Field(default="Private") 
    color: str = Field(default="#3498db")
    
    # Metrics & Progress
    progress: float = Field(default=0.0) 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Identity Link (Points to plural 'users' table)
    user_id: int = Field(foreign_key="users.id")
    
    # Relationships
    # Uses string "User" to avoid circular import crashes
    owner: "User" = Relationship(back_populates="projects")
    
    functionalities: List["Functionality"] = Relationship(
        back_populates="project", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 2: FUNCTIONALITY (The User Story / Epic) ---
class Functionality(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str 
    user_story: Optional[str] = None 
    functional_spec: Optional[str] = None 
    
    priority_level: str = Field(default="Should Have") 
    completion_pct: float = Field(default=0.0)
    
    project_id: int = Field(foreign_key="projects.id") # Matched to __tablename__
    project: Project = Relationship(back_populates="functionalities")
    
    functional_tasks: List["FunctionalTask"] = Relationship(
        back_populates="functionality",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 3: FUNCTIONAL TASK (The Logic Flow / State) ---
class FunctionalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    flow_name: str 
    
    pre_conditions: Optional[str] = None 
    post_conditions: Optional[str] = None 
    input_contract: Optional[str] = None 
    output_contract: Optional[str] = None 
    
    functionality_id: int = Field(foreign_key="functionality.id")
    functionality: "Functionality" = Relationship(back_populates="functional_tasks")
    
    technical_tasks: List["TechnicalTask"] = Relationship(
        back_populates="functional_task",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 4: TECHNICAL TASK (The Engineering Layer) ---
class TechnicalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str 
    module_path: Optional[str] = None 
    
    # Execution DNA
    agent_type: str = Field(default="Backend") 
    strategy_prompt: Optional[str] = None 
    
    # Metrics
    status: str = Field(default="backlog") 
    complexity: int = Field(default=3) 
    risk_level: str = Field(default="Low")
    
    functional_task_id: int = Field(foreign_key="functionaltask.id")
    functional_task: "FunctionalTask" = Relationship(back_populates="technical_tasks")
    
    # Level 5: Atomic To-Dos (Stored as JSON string)
    todo_items: Optional[str] = Field(default="[]")