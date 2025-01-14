from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base
from .note import Note

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    notes = relationship("Note", back_populates="owner", foreign_keys="Note.owner_id")
    
    edited_notes = relationship("Note", foreign_keys="Note.last_edited_by")