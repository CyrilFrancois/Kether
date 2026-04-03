from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List

from core.database import get_session
from core.security import get_current_user
from models.user import User
from models.project import Project
from models.attribute import Attribute, AttributeCreate, AttributeUpdate, AttributeRead
from models.attributeLibrary import AttributeLibrary, AttributeSuggestion

# Prefix matches the frontend's expectation to resolve 404s
router = APIRouter(prefix="/api/attributes", tags=["Attributes"])

# --- 1. PROJECT-SPECIFIC ATTRIBUTE CRUD ---

@router.get("/project/{project_id}", response_model=List[AttributeRead])
async def get_project_attributes(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Fetches all dynamic attributes for a specific project with ownership check."""
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
        
    statement = select(Attribute).where(Attribute.project_id == project_id)
    return db.exec(statement).all()

@router.post("", response_model=AttributeRead)
async def create_attribute(
    attr_in: AttributeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Adds a new dynamic attribute and updates global library popularity."""
    project = db.get(Project, attr_in.project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    # 1. Create the project-specific attribute
    new_attr = Attribute(**attr_in.model_dump())
    db.add(new_attr)
    
    # 2. Update Global Library Registry for smart suggestions
    lib_entry = db.exec(select(AttributeLibrary).where(AttributeLibrary.name == attr_in.key)).first()
    
    if lib_entry:
        lib_entry.total_usage_count += 1
        # Update domain-specific popularity mapping
        pop = dict(lib_entry.domain_popularity) or {}
        pop[project.domain] = pop.get(project.domain, 0) + 1
        lib_entry.domain_popularity = pop
        db.add(lib_entry)
    else:
        # Register new attribute type in the library if seen for the first time
        new_lib = AttributeLibrary(
            name=attr_in.key,
            data_type=attr_in.type,
            total_usage_count=1,
            domain_popularity={project.domain: 1}
        )
        db.add(new_lib)

    db.commit()
    db.refresh(new_attr)
    return new_attr

@router.patch("/{attribute_id}", response_model=AttributeRead)
async def update_attribute(
    attribute_id: int,
    attr_update: AttributeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Updates the value or key of an existing project attribute."""
    db_attr = db.get(Attribute, attribute_id)
    if not db_attr:
        raise HTTPException(status_code=404, detail="Attribute not found")
        
    # Verify ownership via the linked project
    project = db.get(Project, db_attr.project_id)
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = attr_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_attr, key, value)
        
    db.add(db_attr)
    db.commit()
    db.refresh(db_attr)
    return db_attr

# --- 2. GLOBAL ATTRIBUTE SUGGESTIONS ---

@router.get("/suggestions", response_model=List[AttributeSuggestion])
async def get_attribute_suggestions(
    domain: str = Query(..., description="Project domain (e.g. IT, Construction)"),
    limit: int = 10,
    db: Session = Depends(get_session)
):
    """
    Returns ranked attribute suggestions based on global and domain-specific usage.
    """
    all_lib = db.exec(select(AttributeLibrary)).all()
    
    suggestions = []
    for item in all_lib:
        # Scoring Algorithm: (Domain Usage * 3) + Global Usage
        # This prioritizes domain-specific matches while still showing common global fields.
        domain_usage = item.domain_popularity.get(domain, 0)
        score = (domain_usage * 3) + item.total_usage_count
        
        if score > 0:
            suggestions.append(AttributeSuggestion(
                name=item.name,
                data_type=item.data_type,
                icon=item.ui_config.get("icon", "Tag"), # Default icon
                popularity_score=score
            ))
            
    # Sort by descending popularity score
    suggestions.sort(key=lambda x: x.popularity_score, reverse=True)
    return suggestions[:limit]

@router.delete("/{attribute_id}")
async def delete_attribute(
    attribute_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Permanently removes an attribute from a project node."""
    db_attr = db.get(Attribute, attribute_id)
    if not db_attr:
         raise HTTPException(status_code=404, detail="Attribute not found")
    
    project = db.get(Project, db_attr.project_id)
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(db_attr)
    db.commit()
    return {"status": "success", "message": "Attribute removed"}