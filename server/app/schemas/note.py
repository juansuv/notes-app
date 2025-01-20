from pydantic import BaseModel, Field, ValidationError, field_validator
from datetime import datetime
from typing import Optional, List


class NoteBase(BaseModel):
    """
    Esquema base para las notas.
    Contiene campos comunes utilizados en la creación, actualización y respuesta de notas.
    """

    title: str
    content: str
    shared_with: List[int] = Field(
        default_factory=list, description="Lista de IDs de usuarios con quienes se comparte la nota."
    )
    tags: List[str] = Field(
        default_factory=list, description="Etiquetas asociadas a la nota."
    )
    color: Optional[str] = Field(
        default="#ffffff",
        description="Debe ser un código HEX válido (por ejemplo, #ffffff).",
    )

    # Validación personalizada para el título
    @field_validator("title")
    def validate_title(cls, value):
        if len(value.strip()) < 3:
            raise ValueError("Error en el título: Debe tener al menos 3 caracteres.")
        if len(value.strip()) > 100:
            raise ValueError("Error en el título: No puede superar los 100 caracteres.")
        return value

    # Validación personalizada para el contenido
    @field_validator("content")
    def validate_content(cls, value):
        if len(value.strip()) < 10:
            raise ValueError("Error en el contenido: Debe tener al menos 10 caracteres.")
        if len(value.strip()) > 1000:
            raise ValueError("Error en el contenido: No puede superar los 1000 caracteres.")
        return value

    # Eliminación de duplicados en las etiquetas
    @field_validator("tags", mode="before")
    def remove_duplicates(cls, value):
        if value:
            return list(set(value))
        return []

    # Validación personalizada para el color
    @field_validator("color")
    def validate_color(cls, value):
        if value and (not value.startswith("#") or len(value) != 7):
            raise ValueError("Error en el color: Debe ser un código HEX válido, como #ffffff.")
        return value
    
    class Config:
        schema_extra = {
            "example": {
                "title": "Mi Nota",
                "content": "Este es el contenido de mi nota.",
                "shared_with": [1, 2],
                "tags": ["tag1", "tag2"],
                "color": "#ffffff"
            }
        }

class NoteCreate(NoteBase):
    """
    Esquema para la creación de notas.
    Hereda todos los campos de `NoteBase`.
    """
    pass


class NoteUpdate(NoteBase):
    """
    Esquema para la actualización de notas.
    Incluye los campos de `NoteBase` más la versión de la nota para manejo de conflictos.
    """
    version: int = Field(
        ..., description="Versión actual de la nota para manejar conflictos en actualizaciones concurrentes."
    )


class NoteResponse(NoteBase):
    """
    Esquema para la respuesta al cliente con detalles completos de una nota.
    Incluye metadatos como ID, fechas de creación y actualización, versión, etc.
    """

    id: int
    created_at: datetime
    updated_at: datetime
    version: int
    last_edited_by: int
    owner_id: int
    color: str
    shared_with: List[int]
    tags: List[str]

    class Config:
        orm_mode = True  # Habilita la compatibilidad con ORM, permitiendo convertir objetos ORM en esquemas
