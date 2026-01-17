"""add product_master table

Revision ID: f3a4b5c6d7e8
Revises: e2f4a5b6c7d8
Create Date: 2026-01-17 00:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'f3a4b5c6d7e8'
down_revision: str | None = 'e2f4a5b6c7d8'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # product_master テーブルを作成
    op.create_table(
        'product_masters',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('name_en', sa.String(200), nullable=True),
        sa.Column('model_category', sa.String(50), nullable=True),
        sa.Column('tagline', sa.String(255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('base_lead_time_days', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
    )

    # インデックスを作成
    op.create_index('ix_product_masters_model_category', 'product_masters', ['model_category'])
    op.create_index('ix_product_masters_is_active', 'product_masters', ['is_active'])


def downgrade() -> None:
    # インデックスを削除
    op.drop_index('ix_product_masters_is_active', table_name='product_masters')
    op.drop_index('ix_product_masters_model_category', table_name='product_masters')

    # テーブルを削除
    op.drop_table('product_masters')
