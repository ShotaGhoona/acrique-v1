"""rename url to s3_url in product_images

Revision ID: c8f3a1b2d456
Revises: b5a8c2f91d34
Create Date: 2025-01-10

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'c8f3a1b2d456'
down_revision: Union[str, None] = 'b5a8c2f91d34'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """product_imagesテーブルのurlカラムをs3_urlにリネーム"""
    op.alter_column(
        'product_images',
        'url',
        new_column_name='s3_url',
    )


def downgrade() -> None:
    """s3_urlカラムをurlに戻す"""
    op.alter_column(
        'product_images',
        's3_url',
        new_column_name='url',
    )
