import os

from fastapi import APIRouter
from fastapi.responses import FileResponse

from utility.logger import app_logger
from dtos.output import DefaultOutput
from services.files_handler.dtos import Input

files_router = APIRouter(prefix="/files", tags=["files"])

UPLOAD_DIR = "/tmp/task-tracker"

@files_router.post("", response_model=DefaultOutput)
async def upload_file(file: Input.UploadFile):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return DefaultOutput(message=f"File Uploaded successfully", data={"file_path": f"{os.path.join(UPLOAD_DIR, file.filename)}"})

@files_router.get("/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, media_type="application/octet-stream", filename=filename)
    return {"error": "File not found"}