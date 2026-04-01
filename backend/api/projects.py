from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

# --- CRITICAL: MATCHING THE NEW DATABASE.PY ---
from core.database import get_session 
from core.security import get_current_user
from models.user import User
from models.project import Project

router = APIRouter()

# --- 1. LIST ALL PROJECTS ---
@router.get("", response_model=List[Project])
async def list_projects(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session) # Updated to get_session
):
    statement = select(Project).where(Project.user_id == current_user.id)
    results = db.exec(statement)
    return results.all()

# --- 2. CREATE PROJECT ---
@router.post("", response_model=Project)
async def create_project(
    project_in: Project, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session) # Updated to get_session
):
    # Ensure ownership
    project_in.user_id = current_user.id
    
    db.add(project_in)
    db.commit()
    db.refresh(project_in)
    return project_in

# --- 3. GET TREE (Project Map View) ---
@router.get("/tree/{project_id}")
async def get_project_tree(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    # Use db.get to find the record
    project = db.get(Project, project_id)
    
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Returning the object directly works IF relationships are configured 
    # with sa_relationship_kwargs={"lazy": "selectin"} in your models.
    # If not, this JSON might only show the L1 project details.
    return project

# --- 4. GET BACKLOG (Flattened View) ---
@router.get("/backlog/{project_id}")
async def get_project_backlog(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    backlog = []
    # Nested loops to flatten the L1-L4 hierarchy
    for functionality in project.functionalities:
        for f_task in functionality.functional_tasks:
            for t_task in f_task.technical_tasks:
                # Use model_dump for Pydantic v2 / SQLModel compatibility
                task_data = t_task.model_dump() 
                
                # Enrich with parent context for the Frontend "Jira" view
                task_data["parent_functionality"] = functionality.title
                task_data["parent_logic_flow"] = f_task.task_name
                backlog.append(task_data)
                
    return backlog

# --- 5. DELETE PROJECT ---
@router.delete("/{project_id}")
async def delete_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project and all associated hierarchy purged."}