from fastapi import APIRouter

from tasks.dtos import Input
from utility.logger import app_logger
from infra.postgres_setup import db

tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])

@tasks_router.get("")
async def get():
    query = "SELECT * FROM tasks"
    data = await db.fetch_all(query)
    return {"message ": f"Tasks fetched successfully", "data": data}

@tasks_router.get("/{task_id}")
async def get(task_id: int):
    return {"message ": f"Task with id {task_id} fetched successfully"}

@tasks_router.post("")
async def create(payload: Input.CreateTasks):
    app_logger.info(f"Received payload for creating task: {payload}")
    return {"message": "Template Created successfully"}

@tasks_router.put("/{task_id}")
async def update(payload: Input.UpdateTasks):
    app_logger.info(f"Received payload for updating task: {payload}")
    return {"message": "Task Updated successfully"}
