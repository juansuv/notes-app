from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.note import *
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate
from app.schemas.shared_note import ShareNote
from app.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/all_notes", response_model=list[NoteResponse])
async def list_all_notes(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """
    Obtiene todas las notas en la base de datos.
    - Solo se utiliza para propósitos administrativos.
    """
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
    """
    Crea una nueva nota para el usuario autenticado.
    Parámetros:
    - `note`: Datos necesarios para crear la nota (título, contenido, etc.).
    - `db`: Sesión asíncrona de base de datos.
    - `current_user`: Usuario autenticado que será el propietario de la nota.
    """
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
    """
    Obtiene todas las notas creadas por el usuario autenticado.
    Parámetros:
    - `db`: Sesión asíncrona de base de datos.
    - `current_user`: Usuario autenticado.
    """
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
    """
    Obtiene una nota específica por su ID.
    Parámetros:
    - `note_id`: ID de la nota a buscar.
    - `db`: Sesión asíncrona de base de datos.
    - `current_user`: Usuario autenticado.
    """
    note = await get_note_by_id(db, note_id, current_user.id)

    # Manejo de errores basados en la clave "error"
    if "error" in note:
        if note["error"] == "Note not found":
            raise HTTPException(status_code=404, detail="Note not found")
        elif note["error"] == "access denied":
            raise HTTPException(status_code=403, detail="Permission denied")

    # Si no hay errores, retorna la nota
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
    updated_note: NoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Actualiza una nota existente.
    Parámetros:
    - `note_id`: ID de la nota a actualizar.
    - `updated_note`: Datos nuevos de la nota.
    - `db`: Sesión asíncrona de base de datos.
    - `current_user`: Usuario autenticado.
    """
    result = await update_note(db, note_id, current_user.id, updated_note, version=updated_note.version)
    if "error" in result:
        if result["error"] == "Note not found or unauthorized":
            raise HTTPException(status_code=404, detail=result["error"])
        elif result["error"] == "Conflict detected. The note was modified by another user.":
            raise HTTPException(status_code=409, detail=result)
    return result["note"]


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
    """
    Elimina una nota específica.
    Parámetros:
    - `note_id`: ID de la nota a eliminar.
    - `db`: Sesión asíncrona de base de datos.
    - `current_user`: Usuario autenticado.
    """
    success = await delete_note(db, note_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found or not authorized to delete")


@router.post("/{note_id}/share")
async def share_note(note_id: int, share_data: ShareNote, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Comparte una nota con otros usuarios.
    Solo el propietario de la nota puede compartirla.
    Parámetros:
    - `note_id`: ID de la nota a compartir.
    - `share_data`: Lista de IDs de los usuarios con los que se compartirá la nota.
    - `db`: Sesión asíncrona de base de datos.
    - `current_user`: Usuario autenticado.
    """
    note = await get_note_by_id(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or unauthorized")

    # Agregar usuarios al campo `shared_with` y evitar duplicados
    note.shared_with.extend(share_data.shared_with)
    note.shared_with = list(set(note.shared_with))
    await db.commit()
    await db.refresh(note)

    return {"message": "Users added to shared_with", "shared_with": note.shared_with}
