from pydantic import BaseModel, Field

class UserBase(BaseModel):
    """
    Esquema base para representar usuarios.
    Contiene los campos comunes utilizados en otros esquemas relacionados con usuarios.
    """
    username: str = Field(
        ...,
        description="Nombre único de usuario.",
        example="john_doe"
    )

class UserCreate(UserBase):
    """
    Esquema para la creación de un nuevo usuario.
    Extiende `UserBase` añadiendo el campo de contraseña.
    """
    password: str = Field(
        ...,
        description="Contraseña del usuario. Debe estar encriptada antes de almacenarse.",
        example="password123"
    )

class UserLogin(UserCreate):
    """
    Esquema para el inicio de sesión de un usuario.
    Extiende `UserCreate`, reutilizando los campos `username` y `password`.
    """
    pass

class UserResponse(UserBase):
    """
    Esquema para la respuesta al cliente con los detalles del usuario.
    Incluye el `id` del usuario junto con su `username`.
    """
    id: int = Field(
        ...,
        description="Identificador único del usuario.",
        example=1
    )

    class Config:
        """
        Configuración para habilitar compatibilidad con ORM.
        Esto permite mapear directamente objetos de base de datos a esquemas Pydantic.
        """
        orm_mode = True
