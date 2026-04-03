from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

class AttributeLibraryBase(SQLModel):
    """
    Base schema for the Global Attribute Registry.
    Defines the standardized metadata for project properties.
    """
    name: str = Field(index=True, unique=True, description="Unique label for the attribute")
    data_type: str = Field(default="text", description="UI Hint: text, number, list, date, boolean")
    
    # Metadata for UI rendering (e.g., icons, custom placeholders, validation rules)
    ui_config: Dict[str, Any] = Field(
        default_factory=dict, 
        sa_column=Column(JSONB),
        description="Stores icon name, placeholder, and specific field settings"
    )

class AttributeLibrary(AttributeLibraryBase, table=True):
    """
    The Database Table model for the Registry.
    Tracks usage statistics to power the suggestion engine.
    """
    __tablename__: str = "attribute_library"

    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Mapping of domains to usage counts. Example: {"IT": 450, "Construction": 12}
    domain_popularity: Dict[str, int] = Field(
        default_factory=dict, 
        sa_column=Column(JSONB)
    )
    
    total_usage_count: int = Field(default=0, index=True)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )

# --- API SCHEMAS ---

class AttributeLibraryRead(AttributeLibraryBase):
    """Schema for returning full library details via API"""
    id: int
    total_usage_count: int
    domain_popularity: Dict[str, int]

class AttributeSuggestion(SQLModel):
    """
    Simplified schema specifically for frontend autocomplete/dropdowns.
    Used by useAttributes.js to provide ranked suggestions.
    """
    name: str
    data_type: str
    icon: Optional[str] = None
    popularity_score: int