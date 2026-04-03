from typing import List, Optional, Dict, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# Standard imports for rebuild
if TYPE_CHECKING:
    from .user import User
    from .attribute import Attribute, AttributeRead

class ProjectBase(SQLModel):
    """
    Base properties for a Project.
    Focuses on core project management metadata.
    """
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    domain: str = Field(default="General", index=True) 
    status: str = Field(default="Draft")               
    thumbnail_path: Optional[str] = Field(default=None)
    is_favorite: bool = Field(default=False)
    
    node_metadata: Dict[str, Any] = Field(
        default_factory=dict, 
        sa_column=sa.Column(JSONB)
    )

class Project(ProjectBase, table=True):
    """
    The Database Table model for Projects.
    Supports a recursive tree structure (Parent -> Children).
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

# Alias for backward compatibility
ProjectNode = Project

# --- API SCHEMAS ---

class ProjectCreate(ProjectBase):
    parent_id: Optional[int] = None
    level: int = 1

class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    status: Optional[str] = None
    is_favorite: Optional[bool] = None
    thumbnail_path: Optional[str] = None
    node_metadata: Optional[Dict[str, Any]] = None

class ProjectRead(ProjectBase):
    id: int
    user_id: int
    level: int
    created_at: datetime
    updated_at: datetime
    # Use string reference for AttributeRead
    attributes: List["AttributeRead"] = []

class ProjectTreeRead(ProjectRead):
    # Recursive schema for fetching entire hierarchies
    children: List["ProjectTreeRead"] = []

# --- 🚀 CRITICAL FIX: REBUILD MODELS ---
# This resolves the "PydanticUserError: ProjectRead is not fully defined"
from .attribute import AttributeRead # Import here to ensure it's available for rebuild

ProjectRead.model_rebuild()
ProjectTreeRead.model_rebuild()