from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class PresignedUrlResult:
    """署名付きURLの結果"""

    upload_url: str
    file_url: str
    key: str


class IStorageService(ABC):
    """ストレージサービスのインターフェース"""

    @abstractmethod
    def generate_presigned_upload_url(
        self,
        file_name: str,
        content_type: str,
        folder: str = 'uploads',
    ) -> PresignedUrlResult:
        """署名付きアップロードURLを生成

        Args:
            file_name: ファイル名
            content_type: Content-Type (e.g., 'image/jpeg')
            folder: 保存先フォルダパス

        Returns:
            PresignedUrlResult: アップロードURL、公開URL、キー
        """
        pass

    @abstractmethod
    def delete_file(self, key: str) -> bool:
        """ファイルを削除

        Args:
            key: S3オブジェクトキー

        Returns:
            bool: 削除成功したかどうか
        """
        pass
