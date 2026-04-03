import json
import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from sqlalchemy.orm import selectinload

from core.database import get_session 
from core.security import get_current_user
from models.user import User
# Ensure we are importing the renamed ProjectNode
from models.project import ProjectNode, NodeCreate, NodeUpdate, NodeTreeRead, NodeRead

router = APIRouter()

# --- UTILITY: FIND ROOT PROJECT NODE ---
def get_root_metadata(db: Session, node: ProjectNode) -> dict:
    """Recursively climbs the tree to find Level 1 metadata (Tech Stack)."""
    current = node
    # Security: Ensure we don't loop infinitely if data is corrupted
    visited = set() 
    while current.parent_id is not None and current.id not in visited:
        visited.add(current.id)
        parent = db.get(ProjectNode, current.parent_id)
        if not parent:
            break
        current = parent
    # Access the renamed node_metadata field
    return current.node_metadata if current else {}

# --- 1. LIST ROOT PROJECTS (Level 1 Only) ---
@router.get("", response_model=List[NodeRead])
async def list_root_projects(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    statement = select(ProjectNode).where(
        ProjectNode.user_id == current_user.id,
        ProjectNode.level == 1
    )
    results = db.exec(statement)
    return results.all()

# --- 2. CREATE A NODE ---
@router.post("", response_model=NodeRead)
async def create_node(
    node_in: NodeCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    new_node = ProjectNode(
        **node_in.model_dump(),
        user_id=current_user.id
    )
    db.add(new_node)
    db.commit()
    db.refresh(new_node)
    return new_node

# --- 3. GET FULL RECURSIVE TREE ---
@router.get("/tree/{project_id}", response_model=NodeTreeRead)
async def get_project_tree(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    statement = select(ProjectNode).where(
        ProjectNode.id == project_id,
        ProjectNode.user_id == current_user.id
    ).options(selectinload(ProjectNode.children))
    
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="Project node not found")
    return result

# --- 4. UPDATE NODE ---
@router.patch("/{node_id}", response_model=NodeRead)
async def update_node(
    node_id: int,
    node_update: NodeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    db_node = db.get(ProjectNode, node_id)
    if not db_node or db_node.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Node not found")
    
    update_data = node_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        # Handle the renamed node_metadata merge logic
        if key == "node_metadata" and value is not None:
            existing_meta = db_node.node_metadata or {}
            db_node.node_metadata = {**existing_meta, **value}
        else:
            setattr(db_node, key, value)
    
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

# --- 5. AI DECOMPOSITION (The Architect Agent) ---
@router.post("/{node_id}/ai-generate")
async def ai_generate_subnodes(
    node_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    parent_node = db.get(ProjectNode, node_id)
    if not parent_node or parent_node.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Parent node not found")

    if parent_node.level >= 5:
        raise HTTPException(status_code=400, detail="Depth limit reached (Level 5).")

    # 1. Fetch Context using updated utility
    root_meta = get_root_metadata(db, parent_node)
    tech_stack = root_meta.get("tech_stack", "Not specified")

    # 2. Load the System Prompt (assuming this path exists in your Docker/Local setup)
    prompt_path = os.path.join("agents", "prompts", "decomposition.txt")
    if os.path.exists(prompt_path):
        with open(prompt_path, "r") as f:
            system_prompt = f.read()
    else:
        system_prompt = "Decompose {{parent_name}} into {{target_level}} tasks using {{tech_stack}}."

    # 3. Fill Placeholders
    final_prompt = system_prompt.replace("{{parent_level}}", str(parent_node.level)) \
                                .replace("{{target_level}}", str(parent_node.level + 1)) \
                                .replace("{{parent_name}}", parent_node.name) \
                                .replace("{{parent_description}}", parent_node.description or "None") \
                                .replace("{{tech_stack}}", tech_stack)

    # 4. SIMULATION: Mock Architect Response using node_metadata
    mock_response = [
        {
            "name": f"Sub-module for {parent_node.name}",
            "description": "Auto-generated architectural component.",
            "level": parent_node.level + 1,
            "node_metadata": {"generated_by": "ArchitectAgent", "priority": "High"}
        }
    ]

    # 5. Commit generated nodes to DB
    new_children = []
    for child_data in mock_response:
        child_node = ProjectNode(
            **child_data,
            parent_id=parent_node.id,
            user_id=current_user.id
        )
        db.add(child_node)
        new_children.append(child_node)

    db.commit()
    return {"status": "success", "added": len(new_children)}

# --- 6. DELETE NODE ---
@router.delete("/{node_id}")
async def delete_node(
    node_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    node = db.get(ProjectNode, node_id)
    if not node or node.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Node not found")
    
    # SQLAlchemy handles children deletion via cascade configured in models/project.py
    db.delete(node)
    db.commit()
    return {"message": "Node and descendants purged."}