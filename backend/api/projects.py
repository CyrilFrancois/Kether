from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlmodel import select
from typing import List, Dict, Any

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.project import Project, Functionality, FunctionalTask, TechnicalTask

router = APIRouter()

# --- 1. CREATE PROJECT ---
@router.post("/", response_model=Project)
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

# --- 2. GET TREE (For Project Map View) ---
@router.get("/tree/{project_id}")
async def get_project_tree(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Verify ownership
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    # SQLModel relationships handle the nesting automatically
    # We return the project object which includes the 'functionalities' list
    return project

# --- 3. GET BACKLOG (For Jira View) ---
@router.get("/backlog/{project_id}")
async def get_project_backlog(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Verify ownership
    project = db.get(Project, project_id)
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    # We want a flat list of TechnicalTasks, but with Parent Info attached
    backlog = []
    
    for functionality in project.functionalities:
        for f_task in functionality.functional_tasks:
            for t_task in f_task.technical_tasks:
                # We enrich the technical task with context for the UI table
                task_data = t_task.dict()
                task_data["parent_functionality"] = functionality.title
                task_data["parent_logic_flow"] = f_task.task_name
                backlog.append(task_data)
                
    return backlog

# --- 4. DELETE PROJECT (Trigger Cascade) ---
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