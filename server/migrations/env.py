from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import NullPool

from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from app.models.models import Base
from alembic import context
from app.config.db import DATABASE_URL

# Metadata de tus modelos
target_metadata = Base.metadata

# Configuración de la URL de la base de datos
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)


def run_migrations_offline() -> None:
    """Ejecuta las migraciones en modo offline."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Ejecuta las migraciones en modo online."""
    connectable = create_async_engine(
        DATABASE_URL,
        poolclass=NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)


def do_run_migrations(connection):
    """Configuración para ejecutar las migraciones."""
    context.configure(
        connection=connection, target_metadata=target_metadata
    )

    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())