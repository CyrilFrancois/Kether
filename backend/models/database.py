# backend/models/database.py
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# Layer 1: The Project
class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    color: str = "#3498db"
    description: Optional[str] = None
    
    functionalities: List["Functionality"] = Relationship(back_populates="project")

# Layer 2: The Functionality (Groups of tasks)
class Functionality(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    project_id: int = Field(foreign_key="project.id")
    
    project: "Project" = Relationship(back_populates="functionalities")
    tasks: List["FunctionalTask"] = Relationship(back_populates="functionality")

# Layer 3: The Functional Task (User-facing requirements)
class FunctionalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    priority: int = 1 
    difficulty: int = 1
    functionality_id: int = Field(foreign_key="functionality.id")
    
    functionality: "Functionality" = Relationship(back_populates="tasks")
    tech_tasks: List["TechnicalTask"] = Relationship(back_populates="functional_task")

# Layer 4: The Technical Task (AI Execution Level)
class TechnicalTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    code_snippet: Optional[str] = None
    status: str = "todo"  # todo, in_progress, validation, done
    functional_task_id: int = Field(foreign_key="functionaltask.id")
    
    functional_task: "FunctionalTask" = Relationship(back_populates="tech_tasks")