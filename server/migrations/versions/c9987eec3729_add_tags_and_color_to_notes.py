"""Add tags and color to notes

Revision ID: c9987eec3729
Revises: 7021c7347e45
Create Date: 2025-01-16 23:29:00.006929

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c9987eec3729'
down_revision: Union[str, None] = '7021c7347e45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('note', sa.Column('tags', postgresql.ARRAY(sa.String()), nullable=True))
    op.add_column('note', sa.Column('color', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('note', 'color')
    op.drop_column('note', 'tags')
    # ### end Alembic commands ###
