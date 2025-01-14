from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY

from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .base import Base

class Note(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relación con el usuario dueño de la nota
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", back_populates="notes", foreign_keys=[owner_id])
    
    # Control de concurrencia
    version = Column(Integer, default=1)  # Para manejar el bloqueo optimista

    # Colaboración
    shared_with = Column(ARRAY(Integer), default=[])  # Lista de IDs de usuarios con los que se comparte la nota
    last_edited_by = Column(Integer, ForeignKey("user.id"), nullable=True)  # ID del último usuario que editó
    editor = relationship("User", foreign_keys=[last_edited_by])