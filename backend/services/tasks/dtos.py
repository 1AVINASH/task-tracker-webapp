from typing import Dict, Any, Optional
from datetime import datetime

from pydantic import BaseModel, Field, UUID4

from services.tasks.models import Task

class Input:
    class CreateTasks(BaseModel):
        board_id: int = Field(...)
        title: str = Field(..., min_length=1, max_length=20)
        body: str = Field(...)
        priority: int
        running: bool
        seconds: int
    
    class UpdateTasks(BaseModel):
        id: int = Field(...)
        title: str = Field(..., min_length=1, max_length=20)
        body: str = Field(...)
        priority: int
        running: bool
        started_at: Optional[datetime] = ""
        seconds: Optional[float] = 0
        status: str
    
    class MoveUpTask(BaseModel):
        move_up_task: Task
        move_down_task: Task
    
    class MoveDownTask(BaseModel):
        move_up_task: Task
        move_down_task: Task