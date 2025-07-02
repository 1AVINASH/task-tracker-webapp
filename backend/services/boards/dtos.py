from pydantic import BaseModel, Field, UUID4
from typing import Dict, Any, Optional

from services.boards.constants import DEFAULT_THEME

class Input:
    class CreateBoards(BaseModel):
        title: str = Field(..., min_length=1, max_length=20)
        theme: Optional[str] = DEFAULT_THEME # Add a default theme here of your choice
    
    class UpdateBoards(BaseModel):
        id: int = Field(...)
        title: str = Field(..., min_length=1, max_length=20)
        theme: Optional[str] = "" 
    