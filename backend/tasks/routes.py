from fastapi import APIRouter

from tasks.dtos import Input
from utility.logger import app_logger

tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])

@tasks_router.get("/{template_id}")
async def get(template_id: int):
    return {"message ": f"Template with id {template_id} fetched successfully"}

@tasks_router.post("")
async def create(payload: Input.CreateTemplate):
    app_logger.info(f"Received payload for creating template: {payload}")
    return {"message": "Template Created successfully"}

@tasks_router.put("/{template_id}")
async def update(payload: Input.UpdateTemplate):
    app_logger.info(f"Received payload for updating template: {payload}")
    return {"message": "Template Updated successfully"}
