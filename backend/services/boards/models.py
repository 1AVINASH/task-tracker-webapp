import datetime

from pydantic import BaseModel, Field

class Board(BaseModel):
    id: int
    title: str = Field(..., min_length=1, max_length=20)
    theme: str
    last_updated_at: datetime.datetime