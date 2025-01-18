from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from .base import Base


class User(Base):
    """
    Modelo que representa un usuario en la base de datos.
    Incluye campos para el manejo de autenticación y relaciones con las notas que el usuario posee o edita.
    """

    # Identificador único del usuario
    id = Column(Integer, primary_key=True, index=True)

    # Nombre de usuario, único e indexado para búsquedas rápidas
    username = Column(String, unique=True, index=True, nullable=False)

    # Contraseña encriptada del usuario
    password = Column(String, nullable=False)

    # Relación con las notas que el usuario posee
    notes = relationship(
        "Note",
        back_populates="owner",  # Relación inversa definida en `Note.owner`
        foreign_keys="Note.owner_id",  # Especifica la clave foránea en `Note`
    )

    # Relación con las notas que el usuario ha editado
    edited_notes = relationship(
        "Note",
        foreign_keys="Note.last_edited_by",  # Especifica la clave foránea en `Note.last_edited_by`
    )
