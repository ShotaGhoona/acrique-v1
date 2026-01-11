---
description: CIエラーを確認・修正してコミット
---

# CI修正コマンド

## 手順

1. **CI状態確認**
   - `gh pr checks` または `gh run list` で失敗を特定

2. **ローカルでエラー再現**
   - Backend: `docker exec <backend-container> ruff check . && ruff format --check . && python -c "from app.main import app"`
   - Frontend: `cd frontend && npm run build && npm run lint`

3. **エラー修正**
   - 失敗したチェックに対応するコードを修正

4. **再確認後コミット**
   - 修正後、ローカルチェックを再実行
   - `git add . && git commit -m "fix: CIエラーを修正"` でコミット
   - 必要に応じてpush
