from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.note import *
from app.schemas.note import NoteCreate, NoteResponse
from app.schemas.shared_note import ShareNote
from app.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/all_notes", response_model=list[NoteResponse])
async def list_all_notes(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return await get_all_notes(db)


@router.post(
    "/",
    response_model=NoteResponse,
    summary="Crear una nueva nota",
    description="Crea una nueva nota asociada al usuario autenticado. La nota requiere un título y contenido.",
    response_description="La nota recién creada.",
)
async def create_new_note(
    note: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await create_note(db, note, current_user.id)


@router.get(
    "/",
    response_model=list[NoteResponse],
    summary="Listar todas las notas",
    description="Obtén todas las notas creadas por el usuario autenticado.",
    response_description="Lista de todas las notas del usuario.",
)
async def list_user_notes(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return await get_user_notes(db, current_user.id)


@router.get(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Obtener una nota específica",
    description="Obtén los detalles de una nota específica utilizando su ID. Solo está disponible si pertenece al usuario autenticado.",
    response_description="Los detalles de la nota solicitada.",
)
async def get_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = await get_note_by_id(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Actualizar una nota",
    description="Actualiza los detalles de una nota específica utilizando su ID. Solo puede ser editada por el propietario.",
    response_description="La nota actualizada.",
)
async def edit_note(
    note_id: int,
    updated_note: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = await update_note(db, note_id, current_user.id, updated_note)
    if not note:
        raise HTTPException(
            status_code=404, detail="Note not found or not authorized to edit"
        )
    return note


@router.delete(
    "/{note_id}",
    status_code=204,
    summary="Eliminar una nota",
    description="Elimina una nota específica utilizando su ID. Solo puede ser eliminada por el propietario.",
    response_description="Sin contenido.",
)
async def delete_user_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = await delete_note(db, note_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=404, detail="Note not found or not authorized to delete"
        )


@router.post("/{note_id}/share")
async def share_note(note_id: int, share_data: ShareNote, user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Agrega usuarios al campo `shared_with` de una nota.
    Solo el propietario puede compartir la nota.
    """
    # Obtener la nota por ID y validar que el usuario sea el propietario
    result = await db.execute(select(Note).where(Note.id == note_id, Note.owner_id == user_id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or unauthorized")

    # Agregar los nuevos usuarios al campo shared_with
    note.shared_with.extend(share_data.shared_with)
    note.shared_with = list(set(note.shared_with))  # Evitar duplicados

    # Guardar cambios en la base de datos
    await db.commit()
    await db.refresh(note)

    return {"message": "Users added to shared_with", "shared_with": note.shared_with}