from fastapi import APIRouter, Depends, HTTPException, Request, Response    
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import create_user, get_user_by_username
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.utils.authentication import create_access_token, create_refresh_token, decode_refresh_token, verify_password
from app.config.db import get_db
import jwt
from jwt import PyJWTError as JWTError
import os
from dotenv import load_dotenv

# Carga las variables de entorno desde el archivo .env
load_dotenv()

router = APIRouter()


@router.post(
    "/register",
    summary="Registrar un nuevo usuario",
    description="Crea una nueva cuenta de usuario proporcionando un nombre de usuario único y una contraseña.",
    response_description="El usuario registrado con su ID y nombre de usuario.",
    response_model=UserResponse,
)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Registra un nuevo usuario en la base de datos.

    Parámetros:
    - `user`: Datos del usuario a registrar, incluyendo `username` y `password`.
    - `db`: Sesión asíncrona de la base de datos.

    Proceso:
    1. Verifica si el nombre de usuario ya está registrado.
    2. Si no existe, crea el usuario con la contraseña encriptada.
    3. Retorna los datos del usuario recién creado.

    Retorna:
    - Detalles del usuario registrado.
    - Lanza una excepción HTTP 409 si el nombre de usuario ya existe.
    """
    # Verifica si el nombre de usuario ya está registrado
    db_user = await get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=409, detail="Username already registered")

    # Crea y guarda el nuevo usuario en la base de datos
    return await create_user(db, user)


@router.post(
    "/login",
    summary="Iniciar sesión",
    description="Inicia sesión con un nombre de usuario y contraseña válidos para obtener un token JWT.",
    response_description="El token JWT y su tipo (bearer).",
)
async def login_user(userLogin: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Autentica a un usuario y retorna un token JWT.

    Parámetros:
    - `userLogin`: Datos de inicio de sesión (username y password).
    - `db`: Sesión asíncrona de la base de datos.

    Proceso:
    1. Busca al usuario por su nombre de usuario en la base de datos.
    2. Verifica si la contraseña proporcionada coincide con la almacenada.
    3. Genera un token de acceso JWT con el nombre de usuario como dato.
    4. Retorna el token, su tipo, el nombre de usuario y el tiempo de expiración.

    Retorna:
    - Un diccionario con:
        - `token`: El token JWT generado.
        - `token_type`: El tipo de token (bearer).
        - `username`: El nombre de usuario autenticado.
        - `tokenExpiration`: El tiempo de expiración del token en minutos.

    Lanza:
    - HTTPException 400 si las credenciales son inválidas.
    """
    # Busca al usuario en la base de datos
    db_user = await get_user_by_username(db, userLogin.username)

    # Verifica si el usuario existe y si la contraseña es válida
    if not db_user or not verify_password(userLogin.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Genera un token de acceso JWT
    token = create_access_token(data={"sub": db_user.username, "user_id": db_user.id})

    # Retorna el token y la información del usuario autenticado
    return {
        "token": token,
        "token_type": "bearer",
        "username": db_user.username,
        "tokenExpiration": os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"),
    }




from fastapi.responses import JSONResponse

@router.post("/login_cookie")
async def login_cookie(userLogin: UserLogin, db: AsyncSession = Depends(get_db)):
    # Autenticar usuario
    db_user = await get_user_by_username(db, userLogin.username)
    if not db_user or not verify_password(userLogin.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generar token JWT
    token = create_access_token(data={"sub": db_user.username, "user_id": db_user.id})
    refresh_token = create_refresh_token({"sub": db_user.username, "user_id": db_user.id})
    # Crear respuesta con token en cookie segura
    response = JSONResponse(content={"message": "Login successful", "username": db_user.username, "token": f"Bearer {token}"})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False,
        samesite="Strict",
    )
    #agregamos token de refresco
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    return response


@router.post("/logout_cookie")
async def logout_cookie():
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(key="access_token")
    return response



from app.utils.dependencies import  get_current_active_user

@router.post("/refresh")
def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    username= decode_refresh_token(refresh_token)
    # Crear un nuevo token de acceso
    new_access_token = create_access_token({"sub": username})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {new_access_token}",
        httponly=True,
        secure=True,  # Usar solo en HTTPS
        samesite="Strict",  # Prevenir ataques CSRF
    )
    return {"access_token": new_access_token}
    
    