"""add product master columns to products and remove legacy

Revision ID: g4b5c6d7e8f9
Revises: f3a4b5c6d7e8
Create Date: 2026-01-17 00:00:01.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'g4b5c6d7e8f9'
down_revision: str | None = 'f3a4b5c6d7e8'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 新カラム追加
    op.add_column(
        'products',
        sa.Column('master_id', sa.String(100), nullable=True),
    )
    op.add_column(
        'products',
        sa.Column('production_type', sa.String(20), nullable=False, server_default='standard'),
    )
    op.add_column(
        'products',
        sa.Column('upload_requirements', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )

    # 外部キー制約
    op.create_foreign_key(
        'fk_products_master_id',
        'products',
        'product_masters',
        ['master_id'],
        ['id'],
        ondelete='SET NULL',
    )

    # インデックス
    op.create_index('ix_products_master_id', 'products', ['master_id'])
    op.create_index('ix_products_production_type', 'products', ['production_type'])

    # 旧カラム削除
    op.drop_column('products', 'requires_upload')
    op.drop_column('products', 'upload_type')
    op.drop_column('products', 'upload_note')


def downgrade() -> None:
    # 旧カラム復元
    op.add_column('products', sa.Column('upload_note', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('upload_type', sa.String(50), nullable=True))
    op.add_column('products', sa.Column('requires_upload', sa.Boolean(), server_default='false'))

    # インデックス削除
    op.drop_index('ix_products_production_type', table_name='products')
    op.drop_index('ix_products_master_id', table_name='products')

    # 外部キー削除
    op.drop_constraint('fk_products_master_id', 'products', type_='foreignkey')

    # 新カラム削除
    op.drop_column('products', 'upload_requirements')
    op.drop_column('products', 'production_type')
    op.drop_column('products', 'master_id')
