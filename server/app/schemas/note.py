from pydantic import BaseModel
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: str
    shared_with: list[int] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    version: int
    
class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    version: int
    last_edited_by: int
    shared_with: list[int]
    owner_id: int
    class Config:
        orm_mode = True