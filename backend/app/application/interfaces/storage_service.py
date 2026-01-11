"""ストレージサービスのインターフェース"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class PresignedUrlResult:
    """Presigned URL生成結果"""

    upload_url: str
    """アップロード用のPresigned URL"""

    file_url: str
    """アップロード後のファイルURL"""

    s3_key: str
    """S3オブジェクトキー"""

    expires_in: int
    """URLの有効期限（秒）"""


class IStorageService(ABC):
    """ストレージサービスのインターフェース

    S3などのオブジェクトストレージへのファイル操作を抽象化する。
    """

    @abstractmethod
    def generate_presigned_url(
        self,
        file_name: str,
        content_type: str,
        folder: str = 'products',
    ) -> PresignedUrlResult:
        """アップロード用のPresigned URLを生成

        Args:
            file_name: ファイル名（拡張子含む）
            content_type: MIMEタイプ（例: 'image/jpeg'）
            folder: 保存先フォルダ（デフォルト: 'products'）

        Returns:
            PresignedUrlResult: アップロードURL、ファイルURL、有効期限
        """
        pass

    @abstractmethod
    def delete_object(self, file_url: str) -> bool:
        """オブジェクトを削除

        Args:
            file_url: 削除するファイルのURL

        Returns:
            bool: 削除成功時True、失敗時False
        """
        pass
