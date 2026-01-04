"""配送先APIテスト"""

from .client import TestResult, TestRunner
from .config import TEST_ADDRESS


def run_address_tests(runner: TestRunner) -> bool:
    """配送先APIテストを実行（認証済み状態で実行すること）"""
    client = runner.client
    address_id = None

    # 1. 配送先一覧取得（空）
    result = TestResult("配送先一覧取得", "GET", "/api/addresses")
    try:
        resp = client.get("/api/addresses")
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 2. 配送先追加
    result = TestResult("配送先追加", "POST", "/api/addresses")
    try:
        resp = client.post(
            "/api/addresses",
            json={
                "label": "自宅",
                "name": TEST_ADDRESS["recipient_name"],
                "postal_code": TEST_ADDRESS["postal_code"],
                "prefecture": TEST_ADDRESS["prefecture"],
                "city": TEST_ADDRESS["city"],
                "address1": TEST_ADDRESS["address_line1"],
                "address2": TEST_ADDRESS["address_line2"],
                "phone": TEST_ADDRESS["recipient_phone"],
                "is_default": True,
            },
        )
        result.set_result(resp.status_code, 201, resp.json())
        if result.success:
            address_id = resp.json().get("address", {}).get("id")
            runner.context["address_id"] = address_id
    except Exception as e:
        result.set_result(0, 201, error=str(e))
    runner.add_result(result)

    # 3. 配送先詳細取得
    result = TestResult("配送先詳細取得", "GET", f"/api/addresses/{address_id}")
    try:
        if address_id:
            resp = client.get(f"/api/addresses/{address_id}")
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error="配送先IDがありません")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 4. 配送先更新
    result = TestResult("配送先更新", "PUT", f"/api/addresses/{address_id}")
    try:
        if address_id:
            resp = client.put(
                f"/api/addresses/{address_id}",
                json={
                    "label": "会社",
                    "name": "更新後の宛名",
                    "city": "港区",
                },
            )
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error="配送先IDがありません")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 5. 2つ目の配送先追加
    result = TestResult("2つ目の配送先追加", "POST", "/api/addresses")
    second_address_id = None
    try:
        resp = client.post(
            "/api/addresses",
            json={
                "label": "実家",
                "name": "実家太郎",
                "postal_code": "530-0001",
                "prefecture": "大阪府",
                "city": "大阪市北区",
                "address1": "梅田1-1-1",
                "phone": "06-1234-5678",
                "is_default": False,
            },
        )
        result.set_result(resp.status_code, 201, resp.json())
        if result.success:
            second_address_id = resp.json().get("address", {}).get("id")
    except Exception as e:
        result.set_result(0, 201, error=str(e))
    runner.add_result(result)

    # 6. デフォルト設定
    result = TestResult("デフォルト設定", "PUT", f"/api/addresses/{second_address_id}/default")
    try:
        if second_address_id:
            resp = client.put(f"/api/addresses/{second_address_id}/default")
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error="配送先IDがありません")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 7. 配送先一覧取得（2件）
    result = TestResult("配送先一覧取得（2件）", "GET", "/api/addresses")
    try:
        resp = client.get("/api/addresses")
        data = resp.json()
        if resp.status_code == 200 and data.get("total") == 2:
            result.set_result(200, 200, data)
        else:
            result.set_result(resp.status_code, 200, data, error=f"件数が不正: {data.get('total')}")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 8. 配送先削除（1つ目）
    result = TestResult("配送先削除", "DELETE", f"/api/addresses/{address_id}")
    try:
        if address_id:
            resp = client.delete(f"/api/addresses/{address_id}")
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error="配送先IDがありません")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 9. 削除確認（404エラー）
    result = TestResult("削除確認（404）", "GET", f"/api/addresses/{address_id}")
    try:
        if address_id:
            resp = client.get(f"/api/addresses/{address_id}")
            result.set_result(resp.status_code, 404, resp.json())
        else:
            result.set_result(0, 404, error="配送先IDがありません")
    except Exception as e:
        result.set_result(0, 404, error=str(e))
    runner.add_result(result)

    # 10. 配送先一覧取得（1件）
    result = TestResult("配送先一覧取得（1件）", "GET", "/api/addresses")
    try:
        resp = client.get("/api/addresses")
        data = resp.json()
        if resp.status_code == 200 and data.get("total") == 1:
            result.set_result(200, 200, data)
            # 残った配送先のIDを保存（注文テスト用）
            if data.get("addresses"):
                runner.context["address_id"] = data["addresses"][0]["id"]
        else:
            result.set_result(resp.status_code, 200, data, error=f"件数が不正: {data.get('total')}")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


if __name__ == "__main__":
    runner = TestRunner("配送先APIテスト")
    run_address_tests(runner)
