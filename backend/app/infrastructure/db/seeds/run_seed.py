"""シード実行スクリプト"""

import sys
from pathlib import Path

# プロジェクトルートをパスに追加
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))

from sqlalchemy.orm import Session

from app.infrastructure.db.models.product_model import (
    ProductFaqModel,
    ProductFeatureModel,
    ProductImageModel,
    ProductModel,
    ProductOptionModel,
    ProductOptionValueModel,
    ProductRelationModel,
    ProductSpecModel,
)
from app.infrastructure.db.models.user_model import UserModel
from app.infrastructure.db.seeds.product_seed import (
    PRODUCT_FAQS,
    PRODUCT_FEATURES,
    PRODUCT_IMAGES,
    PRODUCT_OPTION_VALUES,
    PRODUCT_OPTIONS,
    PRODUCT_RELATIONS,
    PRODUCT_SPECS,
    PRODUCTS,
)
from app.infrastructure.db.seeds.user_seed import USERS
from app.infrastructure.db.session import SessionLocal


def seed_products(session: Session) -> None:
    """商品データをシード"""
    print('商品データをシード中...')

    # 既存データを削除（外部キー制約の順序に注意）
    session.query(ProductRelationModel).delete()
    session.query(ProductFaqModel).delete()
    session.query(ProductFeatureModel).delete()
    session.query(ProductSpecModel).delete()
    session.query(ProductOptionValueModel).delete()
    session.query(ProductOptionModel).delete()
    session.query(ProductImageModel).delete()
    session.query(ProductModel).delete()
    session.commit()
    print('  既存データを削除しました')

    # 商品を登録
    for product_data in PRODUCTS:
        product = ProductModel(**product_data)
        session.add(product)
    session.commit()
    print(f'  商品を {len(PRODUCTS)} 件登録しました')

    # 商品画像を登録
    for image_data in PRODUCT_IMAGES:
        image = ProductImageModel(**image_data)
        session.add(image)
    session.commit()
    print(f'  商品画像を {len(PRODUCT_IMAGES)} 件登録しました')

    # 商品オプションを登録（option_idを保持するためのマッピング）
    option_id_map: dict[str, int] = {}
    for option_data in PRODUCT_OPTIONS:
        option = ProductOptionModel(**option_data)
        session.add(option)
        session.flush()  # IDを取得するためにflush
        # マッピングキーを作成
        key = f"{option_data['product_id']}_{option_data['name']}"
        option_id_map[key] = option.id
    session.commit()
    print(f'  商品オプションを {len(PRODUCT_OPTIONS)} 件登録しました')

    # 商品オプション値を登録
    for value_data in PRODUCT_OPTION_VALUES:
        option_key = value_data['option_key']
        if option_key not in option_id_map:
            print(f'  警告: オプションキー {option_key} が見つかりません')
            continue

        value = ProductOptionValueModel(
            option_id=option_id_map[option_key],
            label=value_data['label'],
            price_diff=value_data['price_diff'],
            description=value_data['description'],
            sort_order=value_data['sort_order'],
        )
        session.add(value)
    session.commit()
    print(f'  商品オプション値を {len(PRODUCT_OPTION_VALUES)} 件登録しました')

    # 商品スペックを登録
    for spec_data in PRODUCT_SPECS:
        spec = ProductSpecModel(**spec_data)
        session.add(spec)
    session.commit()
    print(f'  商品スペックを {len(PRODUCT_SPECS)} 件登録しました')

    # 商品特長を登録
    for feature_data in PRODUCT_FEATURES:
        feature = ProductFeatureModel(**feature_data)
        session.add(feature)
    session.commit()
    print(f'  商品特長を {len(PRODUCT_FEATURES)} 件登録しました')

    # 商品FAQを登録
    for faq_data in PRODUCT_FAQS:
        faq = ProductFaqModel(**faq_data)
        session.add(faq)
    session.commit()
    print(f'  商品FAQを {len(PRODUCT_FAQS)} 件登録しました')

    # 関連商品を登録
    for relation_data in PRODUCT_RELATIONS:
        relation = ProductRelationModel(**relation_data)
        session.add(relation)
    session.commit()
    print(f'  関連商品を {len(PRODUCT_RELATIONS)} 件登録しました')


def seed_users(session: Session) -> None:
    """ユーザーデータをシード"""
    print('ユーザーデータをシード中...')

    # 既存のシードユーザーを削除（メールアドレスで判定）
    seed_emails = [user['email'] for user in USERS]
    session.query(UserModel).filter(UserModel.email.in_(seed_emails)).delete(
        synchronize_session=False
    )
    session.commit()
    print('  既存シードユーザーを削除しました')

    # ユーザーを登録
    for user_data in USERS:
        user = UserModel(**user_data)
        session.add(user)
    session.commit()
    print(f'  ユーザーを {len(USERS)} 件登録しました')


def run_all_seeds() -> None:
    """全シードを実行"""
    print('=' * 50)
    print('シード開始')
    print('=' * 50)

    session = SessionLocal()
    try:
        seed_users(session)
        seed_products(session)
        print('=' * 50)
        print('シード完了')
        print('=' * 50)
    except Exception as e:
        session.rollback()
        print(f'エラー: {e}')
        raise
    finally:
        session.close()


if __name__ == '__main__':
    run_all_seeds()
