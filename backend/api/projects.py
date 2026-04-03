import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from sqlalchemy.orm import selectinload

from core.database import get_session 
from api.auth import get_current_user # Fixed import to match main.py
from models.user import User
from models.project import Project, ProjectCreate, ProjectUpdate, ProjectRead, ProjectTreeRead
from models.attribute import Attribute

# Removed prefix here because it's handled globally in main.py as /api/projects
router = APIRouter(tags=["Projects"])

# --- UTILITY: GET PROJECT CONTEXT ---
def get_project_context(db: Session, project_id: int) -> dict:
    """Fetches all dynamic attributes for a project to provide context for AI agents."""
    statement = select(Attribute).where(Attribute.project_id == project_id)
    attributes = db.exec(statement).all()
    return {attr.key: attr.value for attr in attributes}

# --- 1. LIST PROJECTS ---
@router.get("", response_model=List[ProjectRead])
async def list_projects(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session),
    level: Optional[int] = 1,
    domain: Optional[str] = None
):
    """Lists projects, defaulting to root level (Level 1)."""
    statement = select(Project).where(
        Project.user_id == current_user.id,
        Project.level == level
    )
    if domain:
        statement = statement.where(Project.domain == domain)
    
    # Eagerly load attributes to avoid N+1 queries
    statement = statement.options(selectinload(Project.attributes))
    
    results = db.exec(statement)
    return results.all()

# --- 2. CREATE A PROJECT (WITH EAV ATTRIBUTES) ---
@router.post("", response_model=ProjectRead)
async def create_project(
    project_in: ProjectCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """
    Creates a project node. 
    Note: Dynamic attributes are usually sent in the project_in 
    if ProjectCreate includes them, or via a separate update.
    """
    # 1. Create the base project
    new_project = Project(
        name=project_in.name,
        description=project_in.description,
        domain=project_in.domain,
        parent_id=project_in.parent_id,
        level=project_in.level,
        status=project_in.status,
        user_id=current_user.id,
        node_metadata=project_in.node_metadata
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # 2. If attributes were passed in the ProjectCreate schema
    # (Assuming ProjectCreate has been updated to accept an attributes list)
    if hasattr(project_in, 'attributes') and project_in.attributes:
        for attr_data in project_in.attributes:
            new_attr = Attribute(
                key=attr_data.key,
                value=str(attr_data.value),
                type=attr_data.type,
                project_id=new_project.id
            )
            db.add(new_attr)
        db.commit()
        db.refresh(new_project)

    return new_project

# --- 3. GET FULL PROJECT TREE ---
@router.get("/tree/{project_id}", response_model=ProjectTreeRead)
async def get_project_tree(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Fetches a project and all its nested sub-nodes recursively."""
    statement = select(Project).where(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).options(
        selectinload(Project.children),
        selectinload(Project.attributes)
    )
    
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return result

# --- 4. UPDATE PROJECT ---
@router.patch("/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Updates common fields and handles metadata merging."""
    db_project = db.get(Project, project_id)
    if not db_project or db_project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if key == "node_metadata" and value is not None:
            existing_meta = db_project.node_metadata or {}
            db_project.node_metadata = {**existing_meta, **value}
        else:
            setattr(db_project, key, value)
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# --- 5. DELETE PROJECT ---
@router.delete("/{project_id}")
async def delete_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Purges project. Cascades handle sub-nodes and EAV attributes."""
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"status": "success", "message": "Project purged."}