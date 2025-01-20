from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.hash import bcrypt


# Crea un nuevo usuario
async def create_user(db: AsyncSession, user: UserCreate):
    """
    Crea un nuevo usuario en la base de datos con una contraseña encriptada.

    Parámetros:
    - `db`: Sesión asíncrona de la base de datos.
    - `user`: Esquema del usuario que contiene los datos a registrar, incluyendo nombre de usuario y contraseña.

    Proceso:
    1. Se encripta la contraseña del usuario para mayor seguridad.
    2. Se crea una nueva instancia del modelo `User` con los datos proporcionados.
    3. Se agrega el usuario a la sesión de base de datos y se confirma la transacción.

    Retorna:
    - El usuario recién creado con sus datos, incluyendo el ID asignado por la base de datos.
    """
    # Encripta la contraseña para mayor seguridad
    hashed_password = bcrypt.hash(user.password)
    # Crea una instancia del modelo `User` con la contraseña encriptada
    db_user = User(username=user.username, password=hashed_password)
    # Agrega el usuario a la sesión de la base de datos
    db.add(db_user)
    await db.commit()  # Confirma los cambios en la base de datos
    await db.refresh(db_user)  # Refresca los datos del usuario desde la base de datos
    return db_user  # Retorna el usuario creado


# Obtiene un usuario por su nombre de usuario
async def get_user_by_username(db: AsyncSession, username: str):
    """
    Recupera un usuario de la base de datos utilizando su nombre de usuario.

    Parámetros:
    - `db`: Sesión asíncrona de la base de datos.
    - `username`: Nombre de usuario que se desea buscar.

    Proceso:
    1. Se ejecuta una consulta en la base de datos para buscar un usuario con el nombre proporcionado.
    2. Retorna el usuario si existe, o `None` si no se encuentra.

    Retorna:
    - La instancia del usuario si se encuentra, o `None` si no existe.
    """
    # Ejecuta una consulta para buscar al usuario por nombre de usuario
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()  # Retorna el usuario o None si no existe


# Obtiene un usuario por su ID
async def get_user_by_id(db: AsyncSession, user_id: int):
    """
    Recupera un usuario de la base de datos utilizando su ID.

    Parámetros:
    - `db`: Sesión asíncrona de la base de datos.
    - `user_id`: ID del usuario que se desea buscar.

    Proceso:
    1. Se ejecuta una consulta en la base de datos para buscar un usuario con el ID proporcionado.
    2. Retorna el usuario si existe, o `None` si no se encuentra.

    Retorna:
    - La instancia del usuario si se encuentra, o `None` si no existe.
    """
    # Ejecuta una consulta para buscar al usuario por ID
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()  # Retorna el usuario o None si no existe
