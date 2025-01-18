from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List


class NoteBase(BaseModel):
    """
    Esquema base para las notas.
    Contiene campos comunes utilizados en la creación, actualización y respuesta de notas.
    """

    title: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="El título debe tener entre 3 y 100 caracteres.",
    )
    content: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="El contenido debe tener entre 10 y 1000 caracteres.",
    )
    shared_with: List[int] = Field(
        default_factory=list,
        description="Lista de IDs de usuarios con quienes se comparte la nota.",
    )
    tags: List[str] = Field(
        default_factory=list, description="Etiquetas asociadas a la nota."
    )
    color: Optional[str] = Field(
        default="#ffffff",
        description="Debe ser un código HEX válido (por ejemplo, #ffffff).",
    )

    # Validación del título: No debe estar vacío
    @field_validator("title")
    def validate_title(cls, value):
        if len(value.strip()) == 0:
            raise ValueError("El título no puede estar vacío.")
        return value

    # Validación del contenido: No debe estar vacío
    @field_validator("content")
    def validate_content(cls, value):
        if len(value.strip()) == 0:
            raise ValueError("El contenido no puede estar vacío.")
        return value

    # Eliminación de duplicados en las etiquetas
    @field_validator("tags", mode="before")
    def remove_duplicates(cls, value):
        if value:
            return list(
                set(value)
            )  # Elimina duplicados manteniendo la lista como un conjunto único
        return []

    # Validación del color: Debe ser un código HEX válido
    @field_validator("color")
    def validate_color(cls, value):
        if value and (not value.startswith("#") or len(value) != 7):
            raise ValueError("El color debe ser un código HEX válido, como #ffffff.")
        return value


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
        ...,
        description="Versión actual de la nota para manejar conflictos en actualizaciones concurrentes.",
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
