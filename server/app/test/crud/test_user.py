import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import create_user, get_user_by_username
from app.schemas.user import UserCreate
from uuid import uuid4


@pytest.mark.asyncio
async def test_create_user_crud(async_session: AsyncSession):
    id=uuid4().hex
    user = UserCreate(username=f"newuser_{id}", password="newpassword")
    print("creating user")
    created_user = await create_user(async_session, user)
    assert created_user.username == f"newuser_{id}"
    assert created_user.password != "newpassword"  # Password debe estar hasheado

