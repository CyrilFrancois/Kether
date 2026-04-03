from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel import Session, select
from typing import List, Optional
from sqlalchemy.orm import selectinload

from core.database import get_session 
from core.security import get_current_user
from models.user import User
from models.project import ProjectNode, NodeCreate, NodeUpdate, NodeTreeRead, NodeRead

router = APIRouter()

# --- 1. LIST ROOT PROJECTS (Level 1 Only) ---
@router.get("", response_model=List[NodeRead])
async def list_root_projects(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    # Only fetch level 1 nodes belonging to the user
    statement = select(ProjectNode).where(
        ProjectNode.user_id == current_user.id,
        ProjectNode.level == 1
    )
    results = db.exec(statement)
    return results.all()

# --- 2. CREATE A NODE (Manual) ---
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
    # We use selectinload to recursively fetch children in one/two queries 
    # rather than N+1 queries.
    statement = select(ProjectNode).where(
        ProjectNode.id == project_id,
        ProjectNode.user_id == current_user.id
    ).options(selectinload(ProjectNode.children))
    
    result = db.exec(statement).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Project node not found")
    
    return result

# --- 4. UPDATE NODE (Smart Inspector Sync) ---
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
        setattr(db_node, key, value)
    
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

# --- 5. AI DECOMPOSITION (The Architect Trigger) ---
@router.post("/{node_id}/ai-generate")
async def ai_generate_subnodes(
    node_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Triggers the Architect Agent to analyze a node (e.g., L2 Functionality)
    and generate child nodes (e.g., L3 Logic Flows).
    """
    parent_node = db.get(ProjectNode, node_id)
    if not parent_node or parent_node.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Parent node not found")

    if parent_node.level >= 5:
        raise HTTPException(status_code=400, detail="Cannot decompose Level 5 nodes.")

    # NOTE: In a real implementation, you'd call your LLM service here
    # and pass the parent_node.description + parent_node.metadata.
    # For now, we simulate the 'Architect' response.
    
    # generated_children = architect_agent.decompose(parent_node)
    # for child in generated_children:
    #     db.add(ProjectNode(**child, parent_id=node_id, user_id=current_user.id))
    
    return {"status": "processing", "message": f"Architect is decomposing node {node_id}..."}

# --- 6. DELETE NODE (Recursive Cascade) ---
@router.delete("/{node_id}")
async def delete_node(
    node_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    node = db.get(ProjectNode, node_id)
    if not node or node.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Node not found")
    
    db.delete(node) # Cascade delete handled by SQLModel Relationship
    db.commit()
    return {"message": "Node and all descendants purged successfully."}