import os
import shutil
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile

# Define the base directory for all project-related assets
# This matches the folder in your structure: backend/workspace_output or a dedicated 'assets' folder
BASE_STORAGE_PATH = Path("foundry/assets")

class StorageService:
    """
    Service to manage physical file storage for projects.
    Handles uploads for project thumbnails and attribute-linked files.
    """

    @staticmethod
    def ensure_directory(path: Path):
        """Creates the directory if it doesn't exist."""
        if not path.exists():
            path.mkdir(parents=True, exist_ok=True)

    @staticmethod
    async def save_project_asset(
        project_id: int, 
        file: UploadFile, 
        category: str = "general"
    ) -> str:
        """
        Saves a file to the project's specific directory.
        Returns the relative path to be stored in the database.
        """
        # Create a safe path: foundry/assets/{project_id}/{category}/
        project_dir = BASE_STORAGE_PATH / str(project_id) / category
        StorageService.ensure_directory(project_dir)

        # Generate a unique filename to prevent collisions
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = project_dir / unique_filename

        # Write the file to disk
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return relative path for DB storage (e.g., "123/general/unique_id.png")
        return str(Path(str(project_id)) / category / unique_filename)

    @staticmethod
    def delete_project_assets(project_id: int):
        """Removes the entire directory associated with a project."""
        project_dir = BASE_STORAGE_PATH / str(project_id)
        if project_dir.exists() and project_dir.is_dir():
            shutil.rmtree(project_dir)

    @staticmethod
    def get_absolute_path(relative_path: str) -> Path:
        """Converts a database-stored path back to a full system path."""
        return BASE_STORAGE_PATH / relative_path

    @staticmethod
    def delete_file(relative_path: str):
        """Deletes a specific file given its relative path."""
        file_path = StorageService.get_absolute_path(relative_path)
        if file_path.exists():
            os.remove(file_path)

# Initialize service instance
storage_service = StorageService()