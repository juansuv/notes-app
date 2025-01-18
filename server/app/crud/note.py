from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.note import Note
from app.schemas.note import NoteCreate
from sqlalchemy.sql.expression import any_


# Crea una nueva nota y la guarda en la base de datos
async def create_note(db: AsyncSession, note: NoteCreate, user_id: int):
    """
    Crea una nueva nota para un usuario específico.
    - `note`: Esquema de la nota a crear.
    - `user_id`: ID del usuario propietario de la nota.
    """
    print(note.shared_with)  # Muestra los usuarios con los que la nota se compartirá
    db_note = Note(
        **note.model_dump(),  # Mapea los campos del esquema a la instancia del modelo
        owner_id=user_id,  # Establece el propietario de la nota
        version=1,  # Inicia la versión en 1
        last_edited_by=user_id  # Registra el usuario que editó por última vez
    )
    db.add(db_note)  # Añade la nota a la sesión de base de datos
    await db.commit()  # Confirma los cambios
    await db.refresh(db_note)  # Refresca la nota con los datos finales
    return db_note


# Obtiene todas las notas de un usuario
async def get_user_notes(db: AsyncSession, user_id: int):
    """
    Recupera todas las notas propiedad de un usuario.
    - `user_id`: ID del usuario cuyas notas se recuperarán.
    """
    result = await db.execute(select(Note).where(Note.owner_id == user_id))
    return result.scalars().all()  # Retorna todas las notas encontradas


# Recupera una nota específica por su ID
async def get_note_by_id(db: AsyncSession, note_id: int, user_id: int):
    """
    Recupera una nota específica por ID si el usuario tiene acceso.
    - `note_id`: ID de la nota.
    - `user_id`: ID del usuario que solicita la nota.
    """
    result = await db.execute(
        select(Note).where(
            (Note.id == note_id)  # Coincide con el ID de la nota
            & (
                (Note.owner_id == user_id) | (user_id == any_(Note.shared_with))
            )  # Verifica permisos
        )
    )
    return result.scalar_one_or_none()  # Retorna la nota o None si no se encuentra


# Obtiene todas las notas en la base de datos
async def get_all_notes(db: AsyncSession):
    """
    Recupera todas las notas de la base de datos.
    """
    result = await db.execute(select(Note))
    return result.scalars().all()


async def update_note(
    db: AsyncSession, note_id: int, user_id: int, updated_note: NoteCreate, version: int
):
    """
    Actualiza una nota existente si el usuario tiene permisos y la versión coincide.
    Se implementa un mecanismo de bloqueo optimista (optimistic locking) para prevenir
    conflictos cuando múltiples usuarios intentan modificar la misma nota simultáneamente.

    Parámetros:
    - `db`: Sesión asíncrona de la base de datos.
    - `note_id`: ID de la nota que se desea actualizar.
    - `user_id`: ID del usuario que solicita la actualización.
    - `updated_note`: Esquema de la nota con los nuevos datos a aplicar.
    - `version`: Versión esperada de la nota para garantizar que no haya cambios concurrentes.

    Retorna:
    - Si la actualización es exitosa, retorna un diccionario con la nota actualizada.
    - Si la nota no existe o el usuario no tiene permisos, retorna un diccionario con un error.
    - Si hay un conflicto de versiones, retorna un diccionario con detalles del conflicto,
      incluyendo la versión actual del servidor y la del cliente.
    """
    # Verifica si la nota existe y si el usuario tiene permisos para acceder a ella
    result = await db.execute(
        select(Note).where(
            (Note.id == note_id)  # Busca la nota por ID
            & (
                (Note.owner_id == user_id) | (user_id == any_(Note.shared_with))
            )  # Verifica permisos
        )
    )
    note = result.scalar_one_or_none()  # Obtiene la nota o None si no se encuentra
    if not note:
        return {
            "error": "Note not found or unauthorized"
        }  # Nota no encontrada o acceso no autorizado

    # Implementa el bloqueo optimista verificando la versión de la nota
    if note.version != version:
        # Retorna un error de conflicto si las versiones no coinciden
        return {
            "error": "Conflict detected. The note was modified by another user.",
            "server_version": {  # Información de la versión actual en el servidor
                "id": note.id,
                "version": note.version,
                "title": note.title,
                "content": note.content,
                "tags": note.tags,
                "color": note.color,
                "shared_with": note.shared_with,
            },
            "client_version": {  # Información de la versión enviada por el cliente
                "title": updated_note.title,
                "content": updated_note.content,
                "tags": updated_note.tags,
                "color": updated_note.color,
                "shared_with": note.shared_with,
            },
        }

    # Actualiza los campos de la nota con los datos proporcionados
    note.title = updated_note.title  # Actualiza el título
    note.content = updated_note.content  # Actualiza el contenido
    note.tags = updated_note.tags  # Actualiza las etiquetas
    note.color = updated_note.color  # Actualiza el color
    note.shared_with = updated_note.shared_with  # Actualiza los usuarios compartidos
    note.version += 1  # Incrementa la versión para reflejar el cambio
    note.last_edited_by = user_id  # Registra al usuario que realizó la última edición

    # Confirma los cambios en la base de datos
    await db.commit()
    # Refresca la nota para obtener los datos actualizados desde la base de datos
    await db.refresh(note)

    # Retorna la nota actualizada en un diccionario
    return {"note": note}


# Elimina una nota específica
async def delete_note(db: AsyncSession, note_id: int, user_id: int):
    """
    Elimina una nota si el usuario es el propietario.
    - `note_id`: ID de la nota.
    - `user_id`: ID del usuario que solicita la eliminación.
    """
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.owner_id == user_id)
    )
    note = result.scalar_one_or_none()
    if not note:
        return False  # Retorna False si la nota no existe o no pertenece al usuario

    await db.delete(note)  # Elimina la nota de la sesión
    await db.commit()  # Confirma los cambios
    return True


# Comparte una nota con otros usuarios
async def share_note(
    db: AsyncSession, note_id: int, user_id: int, shared_with: list[int]
):
    """
    Comparte una nota con una lista de usuarios específicos.
    - `note_id`: ID de la nota a compartir.
    - `user_id`: ID del propietario de la nota.
    - `shared_with`: Lista de IDs de los usuarios con los que se compartirá.
    """
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.owner_id == user_id)
    )
    note = result.scalar_one_or_none()
    if not note:
        return None  # Nota no encontrada o usuario no autorizado

    note.shared_with.extend(shared_with)  # Añade los nuevos usuarios
    note.shared_with = list(set(note.shared_with))  # Elimina duplicados
    await db.commit()  # Confirma los cambios
    await db.refresh(note)  # Refresca los datos de la nota
    return note
