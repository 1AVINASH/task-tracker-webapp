from pydantic import BaseModel, Field, UUID4
from typing import Dict, Any, Optional

class Input:
    class CreateTasks(BaseModel):
        title: str = Field(..., min_length=6, max_length=20)
        body: str = Field(...)
        order: int
        running: bool
        seconds: int
    
    class UpdateTasks(BaseModel):
        id: UUID4 = Field(...)
        title: str = Field(..., min_length=6, max_length=20)
        body: str = Field(...)
        order: int
        running: bool
        seconds: int