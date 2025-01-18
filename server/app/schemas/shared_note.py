from pydantic import BaseModel, Field
from typing import List

class ShareNote(BaseModel):
    """
    Esquema para compartir una nota con otros usuarios.
    Permite especificar una lista de IDs de usuarios con los que se compartirá la nota.
    """
    shared_with: List[int] = Field(
        ...,  # Campo obligatorio
        description="Lista de IDs de usuarios con quienes se compartirá la nota.",
        example=[1, 2, 3]
    )
