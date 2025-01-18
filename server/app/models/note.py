from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY

from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .base import Base
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY


class Note(Base):
    """
    Modelo que representa una nota en la base de datos.
    Incluye atributos para el contenido, etiquetas, colores, control de concurrencia,
    colaboración entre usuarios y relaciones con el modelo `User`.
    """

    # Identificador único de la nota
    id = Column(Integer, primary_key=True, index=True)

    # Título de la nota
    title = Column(String, index=True, nullable=False)

    # Contenido de la nota
    content = Column(Text, nullable=False)

    # Fecha y hora de creación de la nota
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    # Fecha y hora de la última actualización
    # Se actualiza automáticamente cada vez que se modifica la nota
    updated_at = Column(
        TIMESTAMP(timezone=True),
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    # Lista de etiquetas asociadas con la nota (por ejemplo: ["trabajo", "personal"])
    tags = Column(ARRAY(String), default=[])  # Campo para etiquetas

    # Color de la nota (por ejemplo, para destacar notas con colores)
    color = Column(String, nullable=True)

    # ID del usuario propietario de la nota
    owner_id = Column(Integer, ForeignKey("user.id"))

    # Relación con el modelo `User` para identificar al dueño de la nota
    owner = relationship(
        "User",
        back_populates="notes",  # Relación inversa definida en el modelo `User`
        foreign_keys=[owner_id],  # Especifica la clave foránea
    )

    # Control de concurrencia mediante un número de versión
    # Esto ayuda a implementar bloqueo optimista, evitando conflictos cuando varios
    # usuarios intentan actualizar la nota simultáneamente.
    version = Column(Integer, default=1)

    # Colaboración: IDs de los usuarios con los que se comparte esta nota
    shared_with = Column(ARRAY(Integer), default=[])  # Lista de IDs de usuarios

    # ID del último usuario que editó la nota
    last_edited_by = Column(Integer, ForeignKey("user.id"), nullable=True)

    # Relación con el modelo `User` para identificar al último editor
    editor = relationship(
        "User", foreign_keys=[last_edited_by]  # Especifica la clave foránea
    )
