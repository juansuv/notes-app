from pydantic import BaseModel, Field, field_validator


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

    # Validación personalizada para el nombre de usuario
    @field_validator("username")
    def validate_username(cls, value):
        if len(value.strip()) < 3:
            raise ValueError("nombre de usuario: Debe tener al menos 3 caracteres.")
        if len(value.strip()) > 50:
            raise ValueError("nombre de usuario: No puede superar los 50 caracteres.")
        if not value.isalnum():
            raise ValueError("nombre de usuario: Solo puede contener letras y números.")
        return value


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

    # Validación personalizada para la contraseña
    @field_validator("password")
    def validate_password(cls, value):
        if len(value.strip()) < 8:
            raise ValueError("contraseña: Debe tener al menos 8 caracteres.")
        if len(value.strip()) > 30:
            raise ValueError("contraseña: No puede superar los 30 caracteres.")
        if not any(char.isdigit() for char in value):
            raise ValueError("contraseña: Debe contener al menos un número.")
        if not any(char.isupper() for char in value):
            raise ValueError("contraseña: Debe contener al menos una letra mayúscula.")
        return value


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

    
