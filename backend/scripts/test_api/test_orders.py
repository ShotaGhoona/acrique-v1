"""注文APIテスト"""

from .client import TestResult, TestRunner


def run_order_tests(runner: TestRunner) -> bool:
    """注文APIテストを実行（認証済み・配送先ありの状態で実行）"""
    client = runner.client
    address_id = runner.context.get('address_id')
    product_id = runner.context.get('product_id')
    order_id = None

    # 0. 注文用にカートにアイテムを追加
    if product_id:
        client.post(
            '/api/cart/items',
            json={
                'product_id': product_id,
                'quantity': 1,
                'options': {'size': 'A4'},
            },
        )

    # 1. 注文一覧取得（空）
    result = TestResult('注文一覧取得', 'GET', '/api/orders')
    try:
        resp = client.get('/api/orders')
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 2. 注文作成
    result = TestResult('注文作成', 'POST', '/api/orders')
    try:
        if address_id:
            resp = client.post(
                '/api/orders',
                json={
                    'shipping_address_id': address_id,
                    'payment_method': 'stripe',
                    'notes': 'テスト注文です',
                },
            )
            data = resp.json()
            result.set_result(resp.status_code, 201, data)
            if result.success:
                order_id = data.get('order', {}).get('id')
                runner.context['order_id'] = order_id
            else:
                # エラー詳細を表示
                result.error = data.get('detail', data.get('message', str(data)))
        else:
            result.set_result(0, 201, error='配送先IDがありません')
    except Exception as e:
        result.set_result(0, 201, error=str(e))
    runner.add_result(result)

    # 3. 注文詳細取得
    result = TestResult('注文詳細取得', 'GET', f'/api/orders/{order_id}')
    try:
        if order_id:
            resp = client.get(f'/api/orders/{order_id}')
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='注文IDがありません')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 4. 注文一覧取得（1件）
    result = TestResult('注文一覧取得（1件）', 'GET', '/api/orders')
    try:
        resp = client.get('/api/orders')
        data = resp.json()
        if resp.status_code == 200 and data.get('total', 0) >= 1:
            result.set_result(200, 200, data)
        else:
            result.set_result(resp.status_code, 200, data, error='件数が不正')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 5. 注文一覧（ステータスフィルタ）
    result = TestResult('注文一覧（ステータス）', 'GET', '/api/orders?status=pending')
    try:
        resp = client.get('/api/orders', params={'status': 'pending'})
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 6. 注文キャンセル
    result = TestResult('注文キャンセル', 'POST', f'/api/orders/{order_id}/cancel')
    try:
        if order_id:
            resp = client.post(
                f'/api/orders/{order_id}/cancel',
                json={'reason': 'テストキャンセル'},
            )
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='注文IDがありません')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 7. キャンセル済み注文の詳細
    result = TestResult('キャンセル済み注文確認', 'GET', f'/api/orders/{order_id}')
    try:
        if order_id:
            resp = client.get(f'/api/orders/{order_id}')
            data = resp.json()
            if (
                resp.status_code == 200
                and data.get('order', {}).get('status') == 'cancelled'
            ):
                result.set_result(200, 200, data)
            else:
                result.set_result(
                    resp.status_code, 200, data, error='ステータスがcancelledでない'
                )
        else:
            result.set_result(0, 200, error='注文IDがありません')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 8. 他人の注文へのアクセス（403エラー）
    result = TestResult('他人の注文（403）', 'GET', '/api/orders/999999')
    try:
        resp = client.get('/api/orders/999999')
        # 存在しない注文は404、他人の注文は403
        if resp.status_code in [403, 404]:
            result.set_result(resp.status_code, resp.status_code, resp.json())
        else:
            result.set_result(resp.status_code, 404, resp.json())
    except Exception as e:
        result.set_result(0, 404, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


if __name__ == '__main__':
    runner = TestRunner('注文APIテスト')
    run_order_tests(runner)
