from sqlmodel import SQLModel

# Import all models to ensure they are registered with SQLModel's metadata
from .user import User
from .project import Project, ProjectNode
from .attribute import Attribute
# Note: Ensure the filename is attribute_library.py or attributeLibrary.py
# Standardizing on the snake_case file import:
from .attributeLibrary import AttributeLibrary

# Exporting for easy access across the backend
__all__ = [
    "SQLModel",
    "User",
    "Project", 
    "ProjectNode",
    "Attribute",
    "AttributeLibrary"
]