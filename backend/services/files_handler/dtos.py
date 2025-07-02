from pydantic import BaseModel, Field, UUID4
from typing import Dict, Any, Optional
from fastapi import UploadFile


class Input:
    class UploadFile(UploadFile):
        ...