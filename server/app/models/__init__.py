from sqlalchemy.ext.declarative import as_declarative, declared_attr

# Clase base para los modelos
@as_declarative()
class Base:
    id: int
    __name__: str

    # Generar nombres de tablas automáticamente si no están definidos explícitamente
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

