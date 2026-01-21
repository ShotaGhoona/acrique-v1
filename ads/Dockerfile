# TODO: 仮置き - 本番環境ではマルチステージビルドを検討
FROM python:3.12-slim

WORKDIR /app

# システム依存パッケージ
# TODO: 仮置き - 必要に応じて追加（例: libpq-dev for PostgreSQL）
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 依存関係インストール
COPY pyproject.toml ./
# TODO: 仮置き - poetry or pip-tools を使う場合は変更
RUN pip install --no-cache-dir -e .

# ソースコードコピー
COPY . .

# エントリーポイント
# TODO: 仮置き - typer CLIのエントリーポイント
ENTRYPOINT ["python", "-m", "src.cli.main"]
