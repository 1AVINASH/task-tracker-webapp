from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class Task(BaseModel):
    id: int
    title: str = Field(min_length=1, max_length=20)
    body: str = Field()
    priority: int
    running: bool
    seconds: int
    started_at: Optional[datetime] = ""
    status: str