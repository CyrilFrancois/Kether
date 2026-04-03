from typing import List, Optional, Dict, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from .user import User
    from .attribute import Attribute, AttributeRead

class ProjectBase(SQLModel):
    """
    Base properties for a Project.
    Focuses on core project management metadata, avoiding domain-specific fields.
    """
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    domain: str = Field(default="General", index=True) # e.g., 'IT', 'Marketing'
    status: str = Field(default="Draft")               # Draft, Active, Archived
    thumbnail_path: Optional[str] = Field(default=None)
    is_favorite: bool = Field(default=False)
    
    # Flexible metadata for UI/State (e.g. canvas coordinates, expanded states)
    node_metadata: Dict[str, Any] = Field(
        default_factory=dict, 
        sa_column=sa.Column(JSONB)
    )

class Project(ProjectBase, table=True):
    """
    The Database Table model for Projects.
    Acts as both a 'Project' and a 'Node' in the hierarchy.
    """
    __tablename__: str = "projects"

    id: Optional[int] = Field(default=None, primary_key=True)
    
    # --- HIERARCHY ---
    level: int = Field(default=1, index=True) 
    parent_id: Optional[int] = Field(
        default=None, 
        sa_column=sa.Column(
            sa.Integer, 
            sa.ForeignKey("projects.id", ondelete="CASCADE"),
            nullable=True
        )
    )
    
    # Recursive relationships
    children: List["Project"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
        }
    )
    
    parent: Optional["Project"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs={"remote_side": "Project.id"}
    )

    # --- DYNAMIC ATTRIBUTES (EAV Pattern) ---
    attributes: List["Attribute"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # --- OWNERSHIP ---
    user_id: int = Field(foreign_key="users.id")
    owner: Optional["User"] = Relationship(back_populates="projects")
    
    # --- TIMESTAMPS ---
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": sa.func.now()}
    )

# --- ALIAS FOR BACKWARD COMPATIBILITY ---
# This resolves 'ImportError: cannot import name ProjectNode'
ProjectNode = Project

# --- API SCHEMAS ---

class ProjectCreate(ProjectBase):
    """Schema for creating a new project or sub-node"""
    parent_id: Optional[int] = None
    level: int = 1

class ProjectUpdate(SQLModel):
    """Schema for updating project details"""
    name: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    status: Optional[str] = None
    is_favorite: Optional[bool] = None
    thumbnail_path: Optional[str] = None
    node_metadata: Optional[Dict[str, Any]] = None

class ProjectRead(ProjectBase):
    """Standard read schema for project lists"""
    id: int
    user_id: int
    level: int
    created_at: datetime
    updated_at: datetime
    # Nested attributes are pulled here for the Smart Inspector
    attributes: List["AttributeRead"] = []

class ProjectTreeRead(ProjectRead):
    """Recursive schema for fetching entire project hierarchies"""
    children: List["ProjectTreeRead"] = []