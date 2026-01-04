"""依存性注入モジュール

共通のDBセッション取得関数と各ユースケースのDI設定を提供する。
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.infrastructure.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """DBセッションを取得

    FastAPIのDependsで使用する。
    リクエストごとにセッションを作成し、終了時にクローズする。
    例外発生時はロールバック、正常終了時はコミットを行う。

    Yields:
        Session: SQLAlchemyセッション
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
