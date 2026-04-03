from typing import Optional, Any, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from .project import Project

class AttributeBase(SQLModel):
    """
    Base schema for Project Attributes.
    Defines the shape of dynamic data points like 'Budget', 'Deadline', or 'Tech Stack'.
    """
    key: str = Field(index=True, description="The label/identifier of the property")
    value: Any = Field(
        sa_column=sa.Column(JSONB), 
        description="The actual data stored as JSONB to support polymorphic types"
    )
    type: str = Field(
        default="text", 
        description="UI Hint: text, number, list, toggle, date, file"
    )

class Attribute(AttributeBase, table=True):
    """
    The Database Table model for Project Attributes.
    Implements the 'Value' part of the EAV pattern, linked to a specific Project.
    """
    __tablename__: str = "project_attributes"

    id: Optional[int] = Field(default=None, primary_key=True)
    
    # --- RELATIONSHIP ---
    project_id: int = Field(
        sa_column=sa.Column(
            sa.Integer, 
            sa.ForeignKey("projects.id", ondelete="CASCADE"), 
            nullable=False,
            index=True
        )
    )

    # Back-reference to the Project
    project: Optional["Project"] = Relationship(back_populates="attributes")

# --- API SCHEMAS ---

class AttributeCreate(AttributeBase):
    """Schema for creating a new attribute, usually nested within ProjectCreate"""
    project_id: Optional[int] = None

class AttributeUpdate(SQLModel):
    """Schema for partial updates to an attribute's key, value, or type hint"""
    key: Optional[str] = None
    value: Optional[Any] = None
    type: Optional[str] = None

class AttributeRead(AttributeBase):
    """Schema for returning structured attribute data to the Smart Inspector"""
    id: int
    project_id: int