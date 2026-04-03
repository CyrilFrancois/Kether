from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
import sqlalchemy as sa

# --- THE RECURSIVE NODE (Layers 1-5) ---
class ProjectNode(SQLModel, table=True):
    """
    A unified recursive model representing any entity in the project hierarchy:
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
    level: int = Field(default=1, index=True) # 1 through 5
    status: str = Field(default="todo") # todo, in_progress, done, archived
    
    # --- HIERARCHY ---
    parent_id: Optional[int] = Field(
        default=None, 
        sa_column=sa.Column(sa.Integer, sa.ForeignKey("project_nodes.id", ondelete="CASCADE"))
    )
    
    # Self-referential relationship
    children: List["ProjectNode"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "remote_side": "ProjectNode.parent_id" # Corrected remote_side for parent-child
        }
    )
    
    parent: Optional["ProjectNode"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs={"remote_side": "ProjectNode.id"}
    )

    # --- OWNERSHIP ---
    user_id: int = Field(foreign_key="users.id")
    
    # --- DYNAMIC DATA ---
    # RENAMED from 'metadata' to 'node_metadata' to avoid SQLAlchemy reserved keyword conflict
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

# --- SCHEMAS FOR API (Pydantic-only) ---

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
    """Recursive schema for the 5-layer tree fetch"""
    children: List["NodeTreeRead"] = []