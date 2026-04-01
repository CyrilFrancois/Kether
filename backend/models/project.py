from typing import List, Optional
from sqlalchemy import Column, String, Text, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlmodel import SQLModel, Field, Relationship

# --- LAYER 1: PROJECT (The North Star) ---
class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    
    # Technical DNA & UI Style
    tech_stack: Optional[str] = Field(default="Python, React")
    architecture_pattern: Optional[str] = Field(default="Monolith")
    ui_template: Optional[str] = Field(default="Kether Dark")
    
    # Identity Link
    user_id: int = Field(foreign_key="user.id")
    
    # Relationships
    functionalities: List["Functionality"] = Relationship(
        back_populates="project", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 2: FUNCTIONALITY (The User Story) ---
class Functionality(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str # e.g., "User can register"
    description: Optional[str] = None
    priority: int = Field(default=1) # 1-3
    
    project_id: int = Field(foreign_key="project.id")
    project: Project = Relationship(back_populates="functionalities")
    
    functional_tasks: List["FunctionalTask"] = Relationship(
        back_populates="functionality",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 3: FUNCTIONAL TASK (The Logic Flow) ---
class FunctionalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_name: str
    logic_flow: Optional[str] = None # Trigger -> Logic -> Result
    input_data: Optional[str] = None
    output_data: Optional[str] = None
    
    functionality_id: int = Field(foreign_key="functionality.id")
    functionality: Functionality = Relationship(back_populates="functional_tasks")
    
    technical_tasks: List["TechnicalTask"] = Relationship(
        back_populates="functional_task",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# --- LAYER 4: TECHNICAL TASK (The Engineering Layer) ---
class TechnicalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    strategy: Optional[str] = None # How the AI should solve it
    status: str = Field(default="todo") # todo, doing, validating, done
    complexity: int = Field(default=1) # 1-10
    completion_score: float = Field(default=0.0) # 0.0 to 100.0
    
    functional_task_id: int = Field(foreign_key="functionaltask.id")
    functional_task: FunctionalTask = Relationship(back_populates="technical_tasks")
    
    # Atomic To-Dos for this specific technical task
    todos: Optional[str] = Field(default="[]") # JSON string of minimal tasks