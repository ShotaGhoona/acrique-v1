"""商品APIテスト"""

from .client import TestResult, TestRunner


def run_product_tests(runner: TestRunner) -> bool:
    """商品APIテストを実行（認証不要）"""
    client = runner.client
    product_id = None

    # 1. 商品一覧取得
    result = TestResult('商品一覧取得', 'GET', '/api/products')
    try:
        resp = client.get('/api/products')
        data = resp.json()
        result.set_result(resp.status_code, 200, data)
        if result.success and data.get('products'):
            product_id = data['products'][0].get('id')
            runner.context['product_id'] = product_id
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 2. 商品一覧（カテゴリフィルタ）
    result = TestResult('商品一覧（カテゴリ）', 'GET', '/api/products?category_id=shop')
    try:
        resp = client.get('/api/products', params={'category_id': 'shop'})
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 3. 商品一覧（ページング）
    result = TestResult('商品一覧（ページング）', 'GET', '/api/products?limit=5&offset=0')
    try:
        resp = client.get('/api/products', params={'limit': 5, 'offset': 0})
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 4. おすすめ商品
    result = TestResult('おすすめ商品', 'GET', '/api/products/featured')
    try:
        resp = client.get('/api/products/featured')
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 5. 商品検索
    result = TestResult('商品検索', 'GET', '/api/products/search?keyword=test')
    try:
        resp = client.get('/api/products/search', params={'keyword': '名刺'})
        result.set_result(resp.status_code, 200, resp.json())
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 6. 商品詳細
    result = TestResult('商品詳細', 'GET', f'/api/products/{product_id}')
    try:
        if product_id:
            resp = client.get(f'/api/products/{product_id}')
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='商品IDがありません')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 7. 商品オプション
    result = TestResult('商品オプション', 'GET', f'/api/products/{product_id}/options')
    try:
        if product_id:
            resp = client.get(f'/api/products/{product_id}/options')
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='商品IDがありません')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 8. 関連商品
    result = TestResult('関連商品', 'GET', f'/api/products/{product_id}/related')
    try:
        if product_id:
            resp = client.get(f'/api/products/{product_id}/related')
            result.set_result(resp.status_code, 200, resp.json())
        else:
            result.set_result(0, 200, error='商品IDがありません')
    except Exception as e:
        result.set_result(0, 200, error=str(e))
    runner.add_result(result)

    # 9. 存在しない商品
    result = TestResult('存在しない商品', 'GET', '/api/products/nonexistent-999')
    try:
        resp = client.get('/api/products/nonexistent-999')
        result.set_result(resp.status_code, 404, resp.json())
    except Exception as e:
        result.set_result(0, 404, error=str(e))
    runner.add_result(result)

    return runner.print_summary()


if __name__ == '__main__':
    runner = TestRunner('商品APIテスト')
    run_product_tests(runner)
