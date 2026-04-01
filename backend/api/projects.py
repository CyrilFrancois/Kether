from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.project import Project

router = APIRouter()

# --- 1. LIST ALL PROJECTS ---
# Added this because your Dashboard was likely trying to GET /projects
@router.get("", response_model=List[Project])
async def list_projects(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    statement = select(Project).where(Project.user_id == current_user.id)
    results = db.exec(statement)
    return results.all()

# --- 2. CREATE PROJECT ---
# Removed the trailing "/" to avoid the 307 redirect -> 405 error loop
@router.post("", response_model=Project)
async def create_project(
    project_in: Project, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    project_in.user_id = current_user.id
    db.add(project_in)
    db.commit()
    db.refresh(project_in)
    return project_in

# --- 3. GET TREE (For Project Map View) ---
@router.get("/tree/{project_id}")
async def get_project_tree(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Returning the object directly; SQLModel handles relationship nesting
    return project

# --- 4. GET BACKLOG (For Jira View) ---
@router.get("/backlog/{project_id}")
async def get_project_backlog(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    backlog = []
    for functionality in project.functionalities:
        for f_task in functionality.functional_tasks:
            for t_task in f_task.technical_tasks:
                task_data = t_task.model_dump() # model_dump() is the SQLModel/Pydantic v2 way
                task_data["parent_functionality"] = functionality.title
                task_data["parent_logic_flow"] = f_task.task_name
                backlog.append(task_data)
                
    return backlog

# --- 5. DELETE PROJECT ---
@router.delete("/{project_id}")
async def delete_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project and all associated missions purged."}