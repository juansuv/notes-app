from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models import Base

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    notes = relationship("Note", back_populates="owner")