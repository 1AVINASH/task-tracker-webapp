from pydantic import BaseModel, Field, UUID4
from typing import Dict, Any, Optional

class Input:
    class CreateTemplate(BaseModel):
        title: str = Field(..., min_length=6, max_length=20)
        metadata: Optional[Dict[str, Any]] = dict()
    
    class UpdateTemplate(BaseModel):
        id: UUID4 = Field(...)
        title: str = Field(..., min_length=6, max_length=20)
        metadata: Optional[Dict[str, Any]] = dict()