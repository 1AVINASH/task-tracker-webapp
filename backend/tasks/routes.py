from fastapi import APIRouter

from tasks.dtos import Input
from utility.logger import app_logger
from tasks.repository import RepositoryTasks
from dtos.output import DefaultOutput

tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])

@tasks_router.get("", response_model=DefaultOutput)
async def get():
    data = await RepositoryTasks.get_all_tasks()
    return DefaultOutput(message=f"Tasks fetched successfully", data=data)

@tasks_router.get("/{task_id}", response_model=DefaultOutput)
async def get(task_id: int):
    data = await RepositoryTasks.get_task(task_id=task_id)
    return DefaultOutput(message=f"Task with id fetched successfully", data=data)

@tasks_router.post("", response_model=DefaultOutput)
async def create(payload: Input.CreateTasks):
    app_logger.info(f"Received payload for creating task: {payload}")
    data = await RepositoryTasks.add_task(payload)
    return DefaultOutput(message=f"Task Created successfully", data=data)

@tasks_router.put("/move-up", response_model=DefaultOutput)
async def move_up(payload: Input.MoveUpTask):
    app_logger.info(f"Move task up for id {payload.move_up_task.id}")
    print(f"Move task up for id {payload.move_up_task.id}")
    _ = await RepositoryTasks.move_task_up(tasks=payload)
    return DefaultOutput(message=f"Task Moved Up successfully")

@tasks_router.put("/move-down", response_model=DefaultOutput)
async def move_up(payload: Input.MoveDownTask):
    app_logger.info(f"Move task up for id {payload.move_down_task.id}")
    _ = await RepositoryTasks.move_task_down(tasks=payload)
    return DefaultOutput(message=f"Task Moved Down successfully")


@tasks_router.put("/{task_id}", response_model=DefaultOutput)
async def update(payload: Input.UpdateTasks):
    app_logger.info(f"Received payload for updating task: {payload}")
    _ = await RepositoryTasks.update_task(payload)
    return DefaultOutput(message=f"Task Updated successfully", data=payload)

@tasks_router.delete("/all", response_model=DefaultOutput)
async def delete_all():
    app_logger.info(f"Deleting all tasks")
    _ = await RepositoryTasks.delete_all_tasks()
    return DefaultOutput(message=f"Tasks Deleted successfully")

@tasks_router.delete("/{task_id}", response_model=DefaultOutput)
async def delete(task_id: int):
    app_logger.info(f"Deleting task for id {task_id}")
    data = await RepositoryTasks.delete_task(task_id=task_id)
    return DefaultOutput(message=f"Task Deleted successfully", data={"id": task_id})
