"""Admin API Phase 2 テストスクリプト"""

import json
import requests
from datetime import date, timedelta

import os

# コンテナ内からの実行かホストからの実行かで URL を切り替え
if os.path.exists("/.dockerenv"):
    BASE_URL = "http://localhost:8000/api"
else:
    BASE_URL = "http://localhost:8005/api"

# セッションを作成してCookieを保持
session = requests.Session()

results = []


def log_result(name, method, endpoint, status_code, success, response=None, error=None):
    """テスト結果をログ"""
    result = {
        "name": name,
        "method": method,
        "endpoint": endpoint,
        "status": status_code,
        "success": success,
    }
    if response:
        result["response"] = response
    if error:
        result["error"] = error
    results.append(result)
    status = "OK" if success else "NG"
    print(f"[{status}] {method} {endpoint} - {status_code}")
    if not success and error:
        print(f"    Error: {error}")


def test_admin_login():
    """管理者ログイン"""
    r = session.post(
        f"{BASE_URL}/admin/auth/login",
        json={"email": "admin@acrique.jp", "password": "admin123"},
    )
    success = r.status_code == 200

    # クッキーを手動で設定（ドメインの問題を回避）
    if success:
        for cookie in r.cookies:
            session.cookies.set(cookie.name, cookie.value)

    log_result(
        "Admin Login",
        "POST",
        "/api/admin/auth/login",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return success


# ========== Dashboard Tests ==========


def test_dashboard():
    """ダッシュボード取得"""
    r = session.get(f"{BASE_URL}/admin/dashboard")
    success = r.status_code == 200
    log_result(
        "Dashboard",
        "GET",
        "/api/admin/dashboard",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_dashboard_stats():
    """売上統計取得"""
    today = date.today()
    week_ago = today - timedelta(days=7)
    r = session.get(
        f"{BASE_URL}/admin/dashboard/stats",
        params={
            "period": "daily",
            "date_from": week_ago.isoformat(),
            "date_to": today.isoformat(),
        },
    )
    success = r.status_code == 200
    log_result(
        "Dashboard Stats",
        "GET",
        "/api/admin/dashboard/stats",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


# ========== Order Tests ==========


def test_get_orders():
    """注文一覧取得"""
    r = session.get(f"{BASE_URL}/admin/orders", params={"limit": 10})
    success = r.status_code == 200
    log_result(
        "Get Orders",
        "GET",
        "/api/admin/orders",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_get_order_detail(order_id):
    """注文詳細取得"""
    r = session.get(f"{BASE_URL}/admin/orders/{order_id}")
    success = r.status_code == 200
    log_result(
        "Get Order Detail",
        "GET",
        f"/api/admin/orders/{order_id}",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_update_order(order_id):
    """注文更新"""
    r = session.put(
        f"{BASE_URL}/admin/orders/{order_id}",
        json={"admin_notes": "テスト管理者メモ"},
    )
    success = r.status_code == 200
    log_result(
        "Update Order",
        "PUT",
        f"/api/admin/orders/{order_id}",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


# ========== Product Tests ==========


def test_get_products():
    """商品一覧取得"""
    r = session.get(f"{BASE_URL}/admin/products", params={"limit": 10})
    success = r.status_code == 200
    log_result(
        "Get Products",
        "GET",
        "/api/admin/products",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_get_product_detail(product_id):
    """商品詳細取得"""
    r = session.get(f"{BASE_URL}/admin/products/{product_id}")
    success = r.status_code == 200
    log_result(
        "Get Product Detail",
        "GET",
        f"/api/admin/products/{product_id}",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_create_product():
    """商品作成"""
    r = session.post(
        f"{BASE_URL}/admin/products",
        json={
            "id": "test-product-001",
            "name": "Test Product",
            "name_ja": "テスト商品",
            "slug": "test-product-001",
            "tagline": "テスト用商品です",
            "description": "これはテスト用の商品説明です。",
            "base_price": 10000,
            "category_id": "shop",
            "is_active": False,
            "is_featured": False,
            "sort_order": 999,
        },
    )
    success = r.status_code == 201
    log_result(
        "Create Product",
        "POST",
        "/api/admin/products",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_update_product(product_id):
    """商品更新"""
    r = session.put(
        f"{BASE_URL}/admin/products/{product_id}",
        json={"tagline": "更新されたタグライン", "base_price": 12000},
    )
    success = r.status_code == 200
    log_result(
        "Update Product",
        "PUT",
        f"/api/admin/products/{product_id}",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_update_product_specs(product_id):
    """商品スペック更新"""
    r = session.put(
        f"{BASE_URL}/admin/products/{product_id}/specs",
        json={
            "specs": [
                {"label": "サイズ", "value": "100x100x100mm", "sort_order": 0},
                {"label": "重量", "value": "500g", "sort_order": 1},
            ]
        },
    )
    success = r.status_code == 200
    log_result(
        "Update Product Specs",
        "PUT",
        f"/api/admin/products/{product_id}/specs",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_update_product_options(product_id):
    """商品オプション更新"""
    r = session.put(
        f"{BASE_URL}/admin/products/{product_id}/options",
        json={
            "options": [
                {
                    "name": "カラー",
                    "is_required": True,
                    "sort_order": 0,
                    "values": [
                        {"label": "ブラック", "price_diff": 0, "sort_order": 0},
                        {"label": "ホワイト", "price_diff": 500, "sort_order": 1},
                    ],
                }
            ]
        },
    )
    success = r.status_code == 200
    log_result(
        "Update Product Options",
        "PUT",
        f"/api/admin/products/{product_id}/options",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_delete_product(product_id):
    """商品削除"""
    r = session.delete(f"{BASE_URL}/admin/products/{product_id}")
    success = r.status_code == 200
    log_result(
        "Delete Product",
        "DELETE",
        f"/api/admin/products/{product_id}",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


# ========== Admin Logs Tests ==========


def test_get_logs():
    """操作ログ一覧取得"""
    r = session.get(f"{BASE_URL}/admin/logs", params={"limit": 10})
    success = r.status_code == 200
    log_result(
        "Get Logs",
        "GET",
        "/api/admin/logs",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def test_get_logs_filtered():
    """操作ログ一覧（フィルタ付き）"""
    r = session.get(
        f"{BASE_URL}/admin/logs",
        params={"action": "login", "limit": 5},
    )
    success = r.status_code == 200
    log_result(
        "Get Logs (Filtered)",
        "GET",
        "/api/admin/logs?action=login",
        r.status_code,
        success,
        r.json() if success else None,
        r.text if not success else None,
    )
    return r.json() if success else None


def main():
    print("=" * 60)
    print("Admin API Phase 2 テスト")
    print("=" * 60)
    print()

    # ログイン
    print("--- 認証 ---")
    if not test_admin_login():
        print("ログイン失敗。テスト中止。")
        return

    print()
    print("--- ダッシュボード ---")
    test_dashboard()
    test_dashboard_stats()

    print()
    print("--- 注文管理 ---")
    orders_response = test_get_orders()
    if orders_response and orders_response.get("orders"):
        order_id = orders_response["orders"][0]["id"]  # Use id not order_number
        test_get_order_detail(order_id)
        test_update_order(order_id)
    else:
        print("注文データなし - 詳細テストスキップ")

    print()
    print("--- 商品管理 ---")
    test_get_products()

    # 商品作成
    created = test_create_product()
    if created:
        product_id = created["product"]["id"]
        test_get_product_detail(product_id)
        test_update_product(product_id)
        test_update_product_specs(product_id)
        test_update_product_options(product_id)
        test_delete_product(product_id)
    else:
        # 既存の商品でテスト
        products_response = test_get_products()
        if products_response and products_response.get("products"):
            product_id = products_response["products"][0]["id"]
            test_get_product_detail(product_id)

    print()
    print("--- 操作ログ ---")
    test_get_logs()
    test_get_logs_filtered()

    print()
    print("=" * 60)
    print("テスト結果サマリー")
    print("=" * 60)

    success_count = sum(1 for r in results if r["success"])
    total_count = len(results)
    print(f"成功: {success_count}/{total_count}")
    print()

    # 失敗したテストを表示
    failed = [r for r in results if not r["success"]]
    if failed:
        print("失敗したテスト:")
        for r in failed:
            print(f"  - {r['method']} {r['endpoint']}: {r['status']}")
            if r.get("error"):
                print(f"    {r['error'][:200]}")

    # JSON形式で保存
    with open("test_results_phase2.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2, default=str)
    print()
    print("詳細結果: test_results_phase2.json")


if __name__ == "__main__":
    main()
