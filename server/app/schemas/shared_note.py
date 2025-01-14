from pydantic import BaseModel
from typing import List

class ShareNote(BaseModel):
    shared_with: List[int]