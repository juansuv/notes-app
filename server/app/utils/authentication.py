from datetime import datetime, timedelta, timezone
from typing import Union
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from uuid import uuid4

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Variables de configuración
SECRET_KEY = os.getenv("SECRET_KEY")  # Clave secreta para firmar los tokens
ALGORITHM = os.getenv("ALGORITHM")  # Algoritmo de encriptación (ej. HS256)
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")  # Tiempo de expiración del token

# Contexto para encriptar y verificar contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña en texto plano coincide con su hash encriptado.

    Parámetros:
    - `plain_password`: Contraseña en texto plano ingresada por el usuario.
    - `hashed_password`: Contraseña encriptada almacenada en la base de datos.

    Retorna:
    - `True` si la contraseña coincide, de lo contrario `False`.
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    Encripta una contraseña utilizando bcrypt.

    Parámetros:
    - `password`: Contraseña en texto plano.

    Retorna:
    - Contraseña encriptada.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    """
    Crea un token JWT con un tiempo de expiración opcional.

    Parámetros:
    - `data`: Información que se incluirá en el payload del token (ej. `{"sub": "username"}`).
    - `expires_delta`: Duración personalizada para la expiración del token. Si no se proporciona, se usa el valor de `ACCESS_TOKEN_EXPIRE_MINUTES`.

    Retorna:
    - Un token JWT firmado como cadena de texto.
    """
    to_encode = data.copy()

    # Agregar un identificador único para garantizar unicidad
    to_encode.update({"jti": str(uuid4())})

    # Calcula la fecha de expiración
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))

    # Agrega la fecha de expiración al payload
    to_encode.update({"exp": expire})

    # Genera el token firmado
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Union[dict, None]:
    """
    Decodifica un token JWT y valida su firma.

    Parámetros:
    - `token`: El token JWT a decodificar.

    Retorna:
    - Un diccionario con el payload del token si es válido.
    - `None` si el token no es válido o ha expirado.
    """
    try:
        # Decodifica el token utilizando la clave secreta y el algoritmo configurado
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        # Retorna `None` si ocurre cualquier error durante la decodificación
        return None
