from pydantic import BaseModel, Field, UUID4
from typing import Dict, Any, Optional

from services.tasks.models import Task

class Input:
    class CreateBoards(BaseModel):
        title: str = Field(..., min_length=1, max_length=20)
        theme: Optional[str] = "" 
    
    class UpdateBoards(BaseModel):
        id: int = Field(...)
        title: str = Field(..., min_length=1, max_length=20)
        theme: Optional[str] = "" 
    