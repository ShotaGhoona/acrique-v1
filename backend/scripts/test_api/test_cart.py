"""カートAPIテスト"""

from .client import TestResult, TestRunner


def run_cart_tests(runner: TestRunner) -> bool:
    """カートAPIテストを実行（認証済み状態で実行すること）"""
    client = runner.client
    product_id = runner.context.get("product_id")
    cart_item_id = None

    # 1. カート内容取得（空）
    result = TestResult("カート内容取得（空）", "GET", "/api/cart")
    try:
        resp = client.get("/api/cart")
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 2. カートに追加
    result = TestResult("カートに追加", "POST", "/api/cart/items")
    try:
        if product_id:
            resp = client.post(
                "/api/cart/items",
                json={
                    "product_id": product_id,
                    "quantity": 2,
                    "options": {"size": "A4", "paper": "上質紙"},
                },
            )
            result.set_result(resp.status_code, 201, resp.json())
            if result.success:
                cart_item_id = resp.json().get("item", {}).get("id")
                runner.context["cart_item_id"] = cart_item_id
        else:
            result.set_result(0, 201, error="商品IDがありません")
    except Exception as e:
        result.set_result(0, 201, error=str(e))
    runner.add_result(result)

    # 3. カート内容取得（1件）
    result = TestResult("カート内容取得（1件）", "GET", "/api/cart")
    try:
        resp = client.get("/api/cart")
        data = resp.json()
        if resp.status_code == 200 and len(data.get("items", [])) == 1:
            result.set_result(200, 200, data)
        else:
            result.set_result(resp.status_code, 200, data, error=f"件数が不正")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 4. カート商品更新
    result = TestResult("カート商品更新", "PUT", f"/api/cart/items/{cart_item_id}")
    try:
        if cart_item_id:
            resp = client.put(
                f"/api/cart/items/{cart_item_id}",
                json={"quantity": 5},
            )
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error="カートアイテムIDがありません")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 5. 2つ目の商品を追加
    result = TestResult("2つ目の商品追加", "POST", "/api/cart/items")
    second_item_id = None
    try:
        if product_id:
            resp = client.post(
                "/api/cart/items",
                json={
                    "product_id": product_id,
                    "quantity": 1,
                    "options": {"size": "A5", "paper": "コート紙"},
                },
            )
            result.set_result(resp.status_code, 201, resp.json())
            if result.success:
                second_item_id = resp.json().get("item", {}).get("id")
        else:
            result.set_result(0, 201, error="商品IDがありません")
    except Exception as e:
        result.set_result(0, 201, error=str(e))
    runner.add_result(result)

    # 6. カートから削除
    result = TestResult("カートから削除", "DELETE", f"/api/cart/items/{second_item_id}")
    try:
        if second_item_id:
            resp = client.delete(f"/api/cart/items/{second_item_id}")
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error="カートアイテムIDがありません")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 7. カート内容取得（1件に戻る）
    result = TestResult("カート内容取得（1件）", "GET", "/api/cart")
    try:
        resp = client.get("/api/cart")
        data = resp.json()
        if resp.status_code == 200 and len(data.get("items", [])) == 1:
            result.set_result(200, 200, data)
        else:
            result.set_result(resp.status_code, 200, data, error=f"件数が不正")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


def run_cart_clear_test(runner: TestRunner) -> bool:
    """カート全削除テスト（注文テスト後に実行）"""
    client = runner.client

    # カートを空にする
    result = TestResult("カート全削除", "DELETE", "/api/cart")
    try:
        resp = client.delete("/api/cart")
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 空になったか確認
    result = TestResult("カート空確認", "GET", "/api/cart")
    try:
        resp = client.get("/api/cart")
        data = resp.json()
        if resp.status_code == 200 and len(data.get("items", [])) == 0:
            result.set_result(200, 200, data)
        else:
            result.set_result(resp.status_code, 200, data, error="カートが空になっていない")
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


if __name__ == "__main__":
    runner = TestRunner("カートAPIテスト")
    run_cart_tests(runner)
