from typing import List, Optional, Dict, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
import sqlalchemy as sa

if TYPE_CHECKING:
    from .user import User

class Project(SQLModel, table=True):
    """
    The primary model for the project hierarchy.
    Level 1: Project (DNA)
    Level 2: Functionality (User Story)
    Level 3: Logic Flow (Functional Task)
    Level 4: Technical Unit (Technical Task)
    Level 5: Actionable ToDo (Atomic)
    """
    __tablename__: str = "project_nodes"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    level: int = Field(default=1, index=True) 
    status: str = Field(default="todo")
    
    # --- HIERARCHY ---
    parent_id: Optional[int] = Field(
        default=None, 
        sa_column=sa.Column(sa.Integer, sa.ForeignKey("project_nodes.id", ondelete="CASCADE"))
    )
    
    # Self-referential relationship - now referencing "Project"
    children: List["Project"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "remote_side": "Project.parent_id"
        }
    )
    
    parent: Optional["Project"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs={"remote_side": "Project.id"}
    )

    # --- OWNERSHIP ---
    user_id: int = Field(foreign_key="users.id")
    
    # This must match back_populates="projects" in User
    owner: Optional["User"] = Relationship(back_populates="projects")
    
    # --- DYNAMIC DATA ---
    node_metadata: Dict[str, Any] = Field(
        default_factory=dict, 
        sa_column=Column(JSON)
    )
    
    # --- TIMEKEEPING ---
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )

# --- BACKWARD COMPATIBILITY ALIAS ---
# Any code importing ProjectNode will now get the Project class
ProjectNode = Project 

# --- SCHEMAS FOR API ---
# These remain the same but now strictly reference Project/ProjectNode logic
class NodeCreate(SQLModel):
    name: str
    description: Optional[str] = None
    level: int
    parent_id: Optional[int] = None
    node_metadata: Dict[str, Any] = Field(default_factory=dict)

class NodeUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    node_metadata: Optional[Dict[str, Any]] = None

class NodeRead(SQLModel):
    id: int
    name: str
    description: Optional[str]
    level: int
    status: str
    parent_id: Optional[int] = None
    node_metadata: Dict[str, Any]
    created_at: datetime

class NodeTreeRead(NodeRead):
    children: List["NodeTreeRead"] = []