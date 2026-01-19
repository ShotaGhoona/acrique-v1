"""商品シードデータ

ACRIQUE - 極上のアクリルを、1個から。

production_type:
- standard: 入稿なし（既製デザイン）
- template: テキスト/URL/日付入力のみ（ファイルアップロードなし）
- custom: ファイルアップロードあり（ロゴ、写真等）
"""

# =============================================================================
# 商品マスタデータ（形状テンプレート）
# =============================================================================

PRODUCT_MASTERS = [
    # ===== Signature Model =====
    {
        'id': 'canvas',
        'name': 'キャンバス',
        'name_en': 'The Canvas',
        'model_category': 'signature',
        'tagline': '迷ったらこれ。最も美しい比率のアクリルアート。',
        'description': 'A2〜A5の定型規格サイズで展開する、ACRIQUEのシグネチャーモデル。'
        '選び抜かれた厚みとエッジの輝きが、空間の質を底上げします。',
        'base_lead_time_days': 7,
        'is_active': True,
        'sort_order': 1,
    },
    # ===== Standard Model =====
    {
        'id': 'canvas-ratio',
        'name': 'キャンバス レシオ',
        'name_en': 'The Canvas Ratio',
        'model_category': 'standard',
        'tagline': 'パノラマも、スリムも。あなただけの「比率」で仕立てる。',
        'description': '横長のパノラマ風景や、縦長の書道作品に。'
        '定型サイズには収まらない、あなただけの構図をトリミングなしで実現します。',
        'base_lead_time_days': 10,
        'is_active': True,
        'sort_order': 2,
    },
    {
        'id': 'round',
        'name': 'ラウンド',
        'name_en': 'The Canvas Round',
        'model_category': 'standard',
        'tagline': '四角い部屋に、たったひとつの柔らかなリズム。',
        'description': '完全な幾何学円（サークル）。'
        '直線ばかりの室内に有機的な柔らかさをプラスし、視線を集めるアイキャッチとして機能します。',
        'base_lead_time_days': 10,
        'is_active': True,
        'sort_order': 3,
    },
    {
        'id': 'arch',
        'name': 'アーチ',
        'name_en': 'The Canvas Arch',
        'model_category': 'standard',
        'tagline': 'メニューも、誓いの言葉も。特別な日のための形状。',
        'description': '上部は柔らかな曲線、下部は安定した直線。'
        '近年インテリアのトレンドとなっている「アーチ」を、極厚アクリルで再現。',
        'base_lead_time_days': 10,
        'is_active': True,
        'sort_order': 4,
    },
    {
        'id': 'puzzle',
        'name': 'パズル',
        'name_en': 'The Canvas Puzzle',
        'model_category': 'standard',
        'tagline': '二つで一つ。分かち合える唯一無二のアート。',
        'description': 'それぞれ別の場所に飾っても、合わせれば一枚の絵になるストーリー性。'
        '結婚証明書やパートナーシップの証として、形に残る絆を贈ります。',
        'base_lead_time_days': 14,
        'is_active': True,
        'sort_order': 5,
    },
    # ===== Free-cut Model =====
    {
        'id': 'silhouette',
        'name': 'シルエット',
        'name_en': 'The Silhouette',
        'model_category': 'free-cut',
        'tagline': '四角い枠を捨てて、自由な景色へ。',
        'description': '写真の中の被写体を、輪郭に沿って精密にカット。'
        '余白を排除することで、まるでその場に存在しているかのようなリアルな存在感を生み出します。',
        'base_lead_time_days': 10,
        'is_active': True,
        'sort_order': 6,
    },
    {
        'id': 'typography',
        'name': 'タイポグラフィ',
        'name_en': 'The Typography',
        'model_category': 'free-cut',
        'tagline': 'メッセージは、もっと美しくなれる。',
        'description': '一筆書きの筆記体や、連なる文字をそのままアクリルで具現化。'
        'カッティングシートや安価なプレートにはない、圧倒的な立体感と影を落とします。',
        'base_lead_time_days': 10,
        'is_active': True,
        'sort_order': 7,
    },
    {
        'id': 'logo',
        'name': 'ロゴ',
        'name_en': 'The Logo',
        'model_category': 'free-cut',
        'tagline': 'ブランドの「顔」を、厚みで語る。',
        'description': '企業のロゴマークやシンボルを、そのままの形状で切り出すオフィス表札。'
        'オフィスのエントランスや受付に、洗練された印象を与えます。',
        'base_lead_time_days': 10,
        'is_active': True,
        'sort_order': 8,
    },
    # ===== Structure Model =====
    {
        'id': 'a-stand',
        'name': 'Aスタンド',
        'name_en': 'The A Stand',
        'model_category': 'structure',
        'tagline': '景色を切り取る、浮遊するサイン。',
        'description': 'マットな質感の黒皮鉄フレームと、光を透過する10mm厚のアクリル。'
        '相反する二つの素材を組み合わせることで、看板という機能を超えた、オブジェのような佇まいを実現。',
        'base_lead_time_days': 14,
        'is_active': True,
        'sort_order': 9,
    },
    {
        'id': 'stage',
        'name': 'ステージ',
        'name_en': 'The Stage',
        'model_category': 'structure',
        'tagline': '記録のための、最高の「舞台」を。',
        'description': '重厚なマテリアルプレートを「台座」としてセットにし、その上にアクリルを浮かせ付ける構造。'
        'ただ飾るだけではなく、大切な一枚を空間の主役へと押し上げる、ACRIQUEで最も贅沢なレイヤード・アート。',
        'base_lead_time_days': 14,
        'is_active': True,
        'sort_order': 10,
    },
    {
        'id': 'square-stand',
        'name': 'スクエアスタンド',
        'name_en': 'The Square Stand',
        'model_category': 'structure',
        'tagline': '空間を整える、規律ある直線。',
        'description': '垂直に伸びるマットブラックのフレームが、空間に心地よい緊張感を与えます。'
        '吊り下げられた極厚のアクリルは、重厚でありながら浮遊感を演出。',
        'base_lead_time_days': 14,
        'is_active': True,
        'sort_order': 11,
    },
    # ===== Additional Shapes =====
    {
        'id': 'cube',
        'name': 'キューブ',
        'name_en': 'The Cube',
        'model_category': 'standard',
        'tagline': '置くだけで、空間が変わる。',
        'description': '10mm以上の厚みを持つブロック状アクリル。'
        '自立する重厚感と、光の屈折が生み出す輝きで、機能的なアイテムをインテリアに昇華。',
        'base_lead_time_days': 5,
        'is_active': True,
        'sort_order': 12,
    },
    {
        'id': 'plate',
        'name': 'プレート',
        'name_en': 'The Plate',
        'model_category': 'standard',
        'tagline': '情報を、美しく伝える。',
        'description': 'シンプルな平板形状。プライスタグ、ネームプレート、ドアサインなど、'
        '機能性と美しさを両立する汎用形状。',
        'base_lead_time_days': 5,
        'is_active': True,
        'sort_order': 13,
    },
    {
        'id': 'display-case',
        'name': 'ディスプレイケース',
        'name_en': 'The Display Case',
        'model_category': 'standard',
        'tagline': '大切なものを、最高の状態で。',
        'description': '多層構造のアクリルが、コレクションを完全に保護しながら美しく魅せる。'
        'UVカット仕様で、日焼けからも守ります。',
        'base_lead_time_days': 7,
        'is_active': True,
        'sort_order': 14,
    },
]

# =============================================================================
# 商品データ
# =============================================================================

PRODUCTS = [
    # =========================================================================
    # For Shop（店舗・サロンオーナー向け）
    # =========================================================================
    {
        'id': 'shop-cube-qr',
        'master_id': 'cube',
        'category_id': 'shop',
        'production_type': 'template',
        'name': 'QR Code Cube',
        'name_ja': 'QRコードキューブ',
        'slug': 'qr-cube',
        'tagline': 'あなたのQRを、アートに。',
        'description': 'Instagram、決済用QR、Wi-Fi案内など、あらゆるQRコードを高級感あるキューブに。'
        'レジ横やテーブルに置くだけで、店舗の格が上がります。',
        'long_description': '店舗のレジ横やテーブルに置くだけで、空間の格が上がる。'
        'QRコードという機能的なものを、インテリアとして昇華させたプロダクトです。'
        '裏面からのUV印刷により、QRコードは透明なアクリル越しに美しく見え、'
        '側面の鏡面仕上げが高級感を演出します。Instagram、PayPay・楽天ペイなどの決済QR、'
        'Wi-Fiパスワード、Google口コミへの誘導など、様々な用途にお使いいただけます。',
        'base_price': 8800,
        'price_note': 'サイズ・オプションにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'url',
                    'key': 'qr_url',
                    'label': 'QRコードのリンク先URL',
                    'required': True,
                    'placeholder': 'https://instagram.com/yourshop',
                },
                {
                    'type': 'text',
                    'key': 'label_text',
                    'label': '下部に表示するテキスト（任意）',
                    'required': False,
                    'placeholder': '例: @yourshop / Wi-Fi / PayPay',
                    'maxLength': 30,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'shop-logo-cutout',
        'master_id': 'logo',
        'category_id': 'shop',
        'production_type': 'custom',
        'name': 'Logo Cutout Object',
        'name_ja': 'ロゴカットアウト',
        'slug': 'logo-cutout',
        'tagline': 'ブランドを、立体化する。',
        'description': 'あなたのブランドロゴをそのままの形で切り出し。'
        '受付やレジ横に置けば、一目でブランドが伝わります。',
        'long_description': 'ブランドロゴをレーザーカットで精密に切り出し、自立するオブジェに。'
        '透明アクリルの美しさと、10mm以上の厚みが生む重厚感で、'
        'ブランドの存在感を最大限に引き出します。'
        '受付カウンター、レジ横、撮影スポットなど、ブランドを印象づけたい場所に。',
        'base_price': 18000,
        'price_note': 'サイズ・複雑さにより変動',
        'lead_time_days': 10,
        'lead_time_note': '10営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'logo_file',
                    'label': 'ロゴデータ',
                    'required': True,
                    'accept': '.ai,.eps,.pdf,.svg',
                    'maxSizeMB': 50,
                    'note': 'ベクターデータ（AI/EPS/PDF/SVG）を推奨。'
                    'PNG/JPGの場合は高解像度（300dpi以上）でお送りください。',
                }
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'shop-plate-price',
        'master_id': 'plate',
        'category_id': 'shop',
        'production_type': 'template',
        'name': 'Luxury Price Tag',
        'name_ja': 'プライスタグ',
        'slug': 'price-tag',
        'tagline': '商品の価値を、引き立てる。',
        'description': 'ジュエリーや時計など、高級商材にふさわしい重厚なプライスカード。'
        '商品の価値をさらに引き立てます。',
        'long_description': '紙のプライスカードでは表現できない高級感。'
        '10mmの厚みを持つアクリル製プライスタグは、ジュエリー、時計、バッグなどの'
        '高級商材にふさわしい佇まい。UV印刷で価格やスペックを美しく表示し、'
        '商品の価値を最大限に引き立てます。',
        'base_price': 3800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'text',
                    'key': 'product_name',
                    'label': '商品名',
                    'required': True,
                    'placeholder': '例: Cartier Love Ring',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'price',
                    'label': '価格表示',
                    'required': True,
                    'placeholder': '例: ¥1,980,000',
                    'maxLength': 20,
                },
                {
                    'type': 'text',
                    'key': 'spec',
                    'label': 'スペック・補足（任意）',
                    'required': False,
                    'placeholder': '例: K18PG / Size 52',
                    'maxLength': 100,
                },
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 3,
    },
    {
        'id': 'shop-a-stand',
        'master_id': 'a-stand',
        'category_id': 'shop',
        'production_type': 'custom',
        'name': 'A-Frame Sign Stand',
        'name_ja': 'Aフレームサインスタンド',
        'slug': 'a-frame-stand',
        'tagline': '景色を切り取る、浮遊するサイン。',
        'description': '黒皮鉄フレームとアクリルの組み合わせ。店頭に置くだけで目を引く、'
        'オブジェのようなサインスタンド。',
        'long_description': 'マットな質感の黒皮鉄フレームと、光を透過する10mm厚のアクリル。'
        '相反する二つの素材を組み合わせることで、看板という機能を超えた、'
        'オブジェのような佇まいを実現しました。店頭、エントランス、イベント会場など、'
        '人の目を引きたい場所に最適です。',
        'base_price': 48000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 14,
        'lead_time_note': '14営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'design_file',
                    'label': 'デザインデータ',
                    'required': True,
                    'accept': '.ai,.eps,.pdf,.svg,.png,.jpg,.jpeg',
                    'maxSizeMB': 50,
                    'note': 'ロゴ、店名、メニュー等のデザインデータをお送りください。'
                    'ベクターデータ推奨。',
                },
                {
                    'type': 'text',
                    'key': 'notes',
                    'label': 'ご要望・補足（任意）',
                    'required': False,
                    'placeholder': '色味やレイアウトのご希望があればご記入ください',
                    'maxLength': 500,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 4,
    },
    {
        'id': 'shop-plate-menu',
        'master_id': 'plate',
        'category_id': 'shop',
        'production_type': 'standard',
        'name': 'Menu Stand',
        'name_ja': 'メニュースタンド',
        'slug': 'menu-stand',
        'tagline': 'テーブルを、彩る。',
        'description': 'カフェやレストランのテーブルを彩るメニュースタンド。'
        '透明感が清潔さと高級感を演出します。',
        'long_description': 'カフェ、レストラン、バーのテーブルに。'
        '透明アクリルのメニュースタンドは、清潔感と高級感を両立。'
        'A6〜A4サイズに対応し、差し替えも簡単。両面使用可能なタイプもご用意しています。',
        'base_price': 4800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': None,
        'is_active': True,
        'is_featured': False,
        'sort_order': 5,
    },
    {
        'id': 'shop-stage-display',
        'master_id': 'stage',
        'category_id': 'shop',
        'production_type': 'standard',
        'name': 'Display Riser',
        'name_ja': 'ディスプレイライザー',
        'slug': 'display-riser',
        'tagline': '商品を、際立たせる。',
        'description': '商品を美しく見せる階段状のディスプレイ台。'
        '化粧品、アクセサリー、フィギュアなど様々な商品に対応。',
        'long_description': '階段状のディスプレイ台で、商品に高低差をつけて美しく陳列。'
        '化粧品、アクセサリー、フィギュア、食品サンプルなど、'
        '様々な商品の魅力を引き出します。透明アクリルは商品を邪魔せず、'
        'どんな世界観にも馴染みます。',
        'base_price': 9800,
        'price_note': 'サイズ・段数により変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'upload_requirements': None,
        'is_active': True,
        'is_featured': False,
        'sort_order': 6,
    },
    # =========================================================================
    # For Office（スタートアップ・企業担当者向け）
    # =========================================================================
    {
        'id': 'office-canvas-wall',
        'master_id': 'canvas',
        'category_id': 'office',
        'production_type': 'custom',
        'name': 'Floating Wall Sign',
        'name_ja': 'フローティングウォールサイン',
        'slug': 'wall-sign',
        'tagline': 'エントランスを、格上げする。',
        'description': 'エントランスを格上げする浮遊感のある社名サイン。'
        '化粧ビスで壁から浮かせることで、高級感と立体感を演出。',
        'long_description': '企業の顔となるエントランスサイン。'
        '壁から15mm〜30mm浮かせて設置することで、影が生まれ、立体感と高級感を演出します。'
        '透明アクリルに社名やロゴを配置することで、壁の素材感を活かしながら、'
        'ブランドを主張できます。付属の化粧ビス（ステンレス/真鍮から選択可）で、'
        '施工業者様でも簡単に設置いただけます。',
        'base_price': 38000,
        'price_note': 'A4サイズ・10mm厚の場合',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'logo_file',
                    'label': '社名ロゴデータ',
                    'required': True,
                    'accept': '.ai,.eps,.pdf,.svg,.png,.jpg,.jpeg',
                    'maxSizeMB': 50,
                    'note': 'ベクターデータ（AI/EPS/PDF/SVG）推奨。'
                    'JPG/PNGは300dpi以上の高解像度データをご用意ください。',
                },
                {
                    'type': 'text',
                    'key': 'company_name',
                    'label': '社名テキスト（ロゴに含まれない場合）',
                    'required': False,
                    'placeholder': '例: 株式会社ACRIQUE',
                    'maxLength': 100,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'office-stage-tombstone',
        'master_id': 'stage',
        'category_id': 'office',
        'production_type': 'custom',
        'name': 'Deal Tombstone',
        'name_ja': '成約記念モニュメント',
        'slug': 'tombstone',
        'tagline': '節目を、刻む。',
        'description': '上場記念、M&A成立、大型プロジェクト完了など、'
        '企業の節目を刻む記念盾。多層構造で立体的なデザインも可能。',
        'long_description': 'IPO、M&A成立、大型ファイナンス、プロジェクト完了。'
        '企業の重要な節目を形に残す記念盾。'
        '多層構造のアクリルで立体的なデザインを実現し、'
        '関係者への感謝と達成の証を美しく刻みます。'
        '投資銀行、証券会社、法律事務所からの実績多数。',
        'base_price': 35000,
        'price_note': 'デザイン・サイズにより変動',
        'lead_time_days': 14,
        'lead_time_note': '14営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'logo_file',
                    'label': '企業ロゴ',
                    'required': True,
                    'accept': '.ai,.eps,.pdf,.svg,.png,.jpg,.jpeg',
                    'maxSizeMB': 50,
                    'note': '複数企業の場合は全てのロゴをお送りください',
                },
                {
                    'type': 'text',
                    'key': 'deal_title',
                    'label': '案件名・タイトル',
                    'required': True,
                    'placeholder': '例: Series B Funding',
                    'maxLength': 100,
                },
                {
                    'type': 'date',
                    'key': 'deal_date',
                    'label': '成約日',
                    'required': True,
                },
                {
                    'type': 'text',
                    'key': 'amount',
                    'label': '金額（任意）',
                    'required': False,
                    'placeholder': '例: $50 Million',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'participants',
                    'label': '関係者名（任意）',
                    'required': False,
                    'placeholder': '例: Lead Investor: ABC Ventures',
                    'maxLength': 300,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'office-plate-nameplate',
        'master_id': 'plate',
        'category_id': 'office',
        'production_type': 'template',
        'name': 'Desk Name Plate',
        'name_ja': '役員用ネームプレート',
        'slug': 'name-plate',
        'tagline': 'デスクに、威厳を。',
        'description': '社長室、役員デスクにふさわしい重厚なネームプレート。'
        '幾何学的なカッティングでモダンな印象に。',
        'long_description': '社長室、役員室、応接室のデスクに。'
        '15mm〜20mmの厚みを持つアクリル製ネームプレートは、重厚感と透明感を両立。'
        '幾何学的なカッティングでモダンな印象を演出します。'
        '名前、役職を美しくレーザー彫刻。',
        'base_price': 12000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'text',
                    'key': 'name',
                    'label': '氏名',
                    'required': True,
                    'placeholder': '例: 山田 太郎',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'title',
                    'label': '役職',
                    'required': True,
                    'placeholder': '例: 代表取締役 CEO',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'name_en',
                    'label': '英語表記（任意）',
                    'required': False,
                    'placeholder': '例: Taro Yamada',
                    'maxLength': 50,
                },
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 3,
    },
    {
        'id': 'office-stage-award',
        'master_id': 'stage',
        'category_id': 'office',
        'production_type': 'custom',
        'name': 'Award Trophy',
        'name_ja': 'アワードトロフィー',
        'slug': 'award',
        'tagline': '功績を、称える。',
        'description': '社内表彰、MVP、永年勤続など、'
        '従業員のモチベーションを高める美しいトロフィー。',
        'long_description': 'MVP表彰、営業成績優秀者、永年勤続、プロジェクト完了。'
        '従業員の功績を称え、モチベーションを高めるアワードトロフィー。'
        '透明アクリルの美しさと、カスタムデザインで、'
        '受賞者の誇りとなる一品を。毎年のアワードにも対応いたします。',
        'base_price': 18000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 10,
        'lead_time_note': '10営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'logo_file',
                    'label': '企業ロゴ',
                    'required': True,
                    'accept': '.ai,.eps,.pdf,.svg,.png,.jpg,.jpeg',
                    'maxSizeMB': 50,
                    'note': 'ベクターデータ推奨',
                },
                {
                    'type': 'text',
                    'key': 'award_title',
                    'label': '賞のタイトル',
                    'required': True,
                    'placeholder': '例: MVP Award 2026',
                    'maxLength': 100,
                },
                {
                    'type': 'text',
                    'key': 'recipient',
                    'label': '受賞者名',
                    'required': True,
                    'placeholder': '例: 山田 太郎',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'reason',
                    'label': '受賞理由（任意）',
                    'required': False,
                    'placeholder': '例: For Outstanding Sales Performance',
                    'maxLength': 200,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 4,
    },
    {
        'id': 'office-plate-door',
        'master_id': 'plate',
        'category_id': 'office',
        'production_type': 'template',
        'name': 'Door Sign',
        'name_ja': 'ドアサイン',
        'slug': 'door-sign',
        'tagline': '空間を、導く。',
        'description': '会議室、役員室、部署名など、オフィス内のサインを統一感あるデザインで。',
        'long_description': '会議室A、応接室、社長室、経理部。'
        'オフィス内の部屋名・部署名サインを統一感あるアクリルで。'
        '壁付け、ドア用、スタンドタイプなど設置場所に合わせてご提案。'
        'ピクトグラム対応で、来客にもわかりやすいサインを実現します。',
        'base_price': 6800,
        'price_note': 'サイズ・数量により変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'text',
                    'key': 'room_name',
                    'label': '部屋名・部署名',
                    'required': True,
                    'placeholder': '例: Meeting Room A',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'room_name_ja',
                    'label': '日本語名（任意）',
                    'required': False,
                    'placeholder': '例: 会議室A',
                    'maxLength': 50,
                },
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 5,
    },
    {
        'id': 'office-logo-reception',
        'master_id': 'logo',
        'category_id': 'office',
        'production_type': 'custom',
        'name': 'Reception Sign',
        'name_ja': 'レセプションサイン',
        'slug': 'reception',
        'tagline': '来客を、迎える。',
        'description': '受付カウンターに設置するウェルカムサイン。'
        '来客の第一印象を決める重要なアイテム。',
        'long_description': '受付カウンターは企業の顔。'
        '来客が最初に目にするレセプションサインで、第一印象を決めます。'
        '社名ロゴを美しく配置し、ウェルカムメッセージを添えて。'
        '卓上タイプ、壁掛けタイプなど、設置場所に合わせてご提案します。',
        'base_price': 25000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'logo_file',
                    'label': '企業ロゴ',
                    'required': True,
                    'accept': '.ai,.eps,.pdf,.svg,.png,.jpg,.jpeg',
                    'maxSizeMB': 50,
                    'note': 'ベクターデータ推奨',
                },
                {
                    'type': 'text',
                    'key': 'welcome_message',
                    'label': 'ウェルカムメッセージ（任意）',
                    'required': False,
                    'placeholder': '例: Welcome to ACRIQUE',
                    'maxLength': 100,
                },
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 6,
    },
    # =========================================================================
    # For You（個人・ギフト向け）
    # =========================================================================
    {
        'id': 'you-display-card',
        'master_id': 'display-case',
        'category_id': 'you',
        'production_type': 'standard',
        'name': 'Trading Card Display',
        'name_ja': 'トレカディスプレイ',
        'slug': 'card-display',
        'tagline': '大切な1枚を、博物館レベルで。',
        'description': 'ポケカ、遊戯王、MTGなど、'
        '大切なカードを博物館レベルで展示。UVカットアクリルで日焼けからも守ります。',
        'long_description': '高額カード、思い出のカード、推しのカード。'
        '大切な1枚を、最高の状態で展示・保管するためのディスプレイケースです。'
        '3層構造のアクリルがカードを完全に包み込み、ホコリ、傷、'
        'そしてUVカットアクリルにより日焼けからも守ります。'
        'カード枠には繊細なレーザー彫刻で装飾を施し、'
        'まるで美術館の展示のような佇まいを実現しました。',
        'base_price': 9800,
        'price_note': 'スタンダードサイズ・UVカット仕様',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': None,
        'is_active': True,
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'you-arch-wedding',
        'master_id': 'arch',
        'category_id': 'you',
        'production_type': 'template',
        'name': 'Wedding Welcome Board',
        'name_ja': 'ウェディングボード',
        'slug': 'wedding-board',
        'tagline': '二人の門出を、彩る。',
        'description': '透け感を活かしたエレガントなウェルカムボード。'
        '式の後もインテリアとして飾れます。',
        'long_description': '「Welcome to our wedding」。'
        '結婚式のエントランスを華やかに彩るアクリル製ウェルカムボード。'
        '透明なアクリルに白やゴールドの文字が映え、写真映えも抜群。'
        '式の後もインテリアとして、二人の思い出を永遠に飾れます。'
        'A3〜A2サイズの大判対応。',
        'base_price': 25000,
        'price_note': 'A3サイズ〜',
        'lead_time_days': 10,
        'lead_time_note': '10営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'text',
                    'key': 'groom_name',
                    'label': '新郎のお名前',
                    'required': True,
                    'placeholder': '例: Taro',
                    'maxLength': 30,
                },
                {
                    'type': 'text',
                    'key': 'bride_name',
                    'label': '新婦のお名前',
                    'required': True,
                    'placeholder': '例: Hanako',
                    'maxLength': 30,
                },
                {
                    'type': 'date',
                    'key': 'wedding_date',
                    'label': '挙式日',
                    'required': True,
                },
                {
                    'type': 'text',
                    'key': 'message',
                    'label': 'メッセージ（任意）',
                    'required': False,
                    'placeholder': '例: Welcome to our wedding',
                    'maxLength': 100,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'you-puzzle-wedding',
        'master_id': 'puzzle',
        'category_id': 'you',
        'production_type': 'template',
        'name': 'Wedding Puzzle Certificate',
        'name_ja': '結婚証明書パズル',
        'slug': 'wedding-puzzle',
        'tagline': '二つで一つ。永遠の約束を刻む。',
        'description': 'パズルピースのように組み合わせる結婚証明書。'
        '離れていても、合わせれば一つになる絆の証。',
        'long_description': 'それぞれが半分ずつ持ち、合わせれば一枚になる結婚証明書。'
        '離れて暮らす両家に一枚ずつ飾ることも、'
        '二人の新居で合わせて飾ることもできます。'
        '誓いの言葉と二人の名前を刻み、永遠の約束を形にします。',
        'base_price': 38000,
        'price_note': 'A4相当サイズ',
        'lead_time_days': 14,
        'lead_time_note': '14営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'text',
                    'key': 'groom_name',
                    'label': '新郎のお名前（フルネーム）',
                    'required': True,
                    'placeholder': '例: 山田 太郎',
                    'maxLength': 50,
                },
                {
                    'type': 'text',
                    'key': 'bride_name',
                    'label': '新婦のお名前（フルネーム）',
                    'required': True,
                    'placeholder': '例: 鈴木 花子',
                    'maxLength': 50,
                },
                {
                    'type': 'date',
                    'key': 'wedding_date',
                    'label': '挙式日',
                    'required': True,
                },
                {
                    'type': 'text',
                    'key': 'vow',
                    'label': '誓いの言葉（任意）',
                    'required': False,
                    'placeholder': '例: ともに歩み、ともに生きることを誓います',
                    'maxLength': 200,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 3,
    },
    {
        'id': 'you-canvas-baby',
        'master_id': 'canvas',
        'category_id': 'you',
        'production_type': 'custom',
        'name': 'Baby Hand/Foot Print',
        'name_ja': '手形足形アート',
        'slug': 'baby-print',
        'tagline': '成長の証を、永遠に。',
        'description': '赤ちゃんの手形・足形を実寸大でレーザー彫刻。'
        '出産祝い、内祝いに最適な一生の宝物。',
        'long_description': '赤ちゃんの小さな手形・足形を、実寸大でアクリルにレーザー彫刻。'
        '紙や粘土とは違い、劣化せず永遠に美しさを保ちます。'
        'お名前、生年月日、出生時の体重・身長も一緒に刻印可能。'
        '出産祝い、内祝い、祖父母へのプレゼントに最適な、一生の宝物になります。',
        'base_price': 18000,
        'price_note': 'A4サイズ',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'print_file',
                    'label': '手形・足形データ',
                    'required': True,
                    'accept': 'image/*,.pdf',
                    'maxSizeMB': 50,
                    'note': '手形・足形の写真またはスキャンデータ（実寸大推奨）をお送りください。',
                },
                {
                    'type': 'text',
                    'key': 'baby_name',
                    'label': '赤ちゃんのお名前',
                    'required': True,
                    'placeholder': '例: 太郎',
                    'maxLength': 30,
                },
                {
                    'type': 'date',
                    'key': 'birth_date',
                    'label': '生年月日',
                    'required': True,
                },
                {
                    'type': 'text',
                    'key': 'birth_weight',
                    'label': '出生時体重（任意）',
                    'required': False,
                    'placeholder': '例: 3,250g',
                    'maxLength': 20,
                },
                {
                    'type': 'text',
                    'key': 'birth_height',
                    'label': '出生時身長（任意）',
                    'required': False,
                    'placeholder': '例: 50.5cm',
                    'maxLength': 20,
                },
            ]
        },
        'is_active': True,
        'is_featured': True,
        'sort_order': 4,
    },
    {
        'id': 'you-canvas-photo',
        'master_id': 'canvas',
        'category_id': 'you',
        'production_type': 'custom',
        'name': 'Acrylic Photo Frame',
        'name_ja': 'アクリルフォトフレーム',
        'slug': 'photo-frame',
        'tagline': '思い出を、永遠に。',
        'description': '写真をアクリルに封入し、永遠に色褪せない思い出に。'
        '結婚式、家族写真、ペットの写真に。',
        'long_description': '大切な写真をアクリルに封入し、永遠に色褪せない思い出に。'
        '結婚式、家族写真、ペットの写真、旅行の思い出。'
        '10mm〜20mmの厚みが生む重厚感で、写真が美術品のような佇まいに。'
        '磁石式で写真の入れ替えも簡単なタイプもご用意。',
        'base_price': 9800,
        'price_note': 'L判サイズ〜',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'photo_file',
                    'label': '写真データ',
                    'required': True,
                    'accept': 'image/*',
                    'maxSizeMB': 50,
                    'note': 'JPG/PNG形式、300dpi以上推奨。',
                }
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 5,
    },
    {
        'id': 'you-silhouette-stand',
        'master_id': 'silhouette',
        'category_id': 'you',
        'production_type': 'custom',
        'name': 'Acrylic Stand',
        'name_ja': 'アクリルスタンド',
        'slug': 'acrylic-stand',
        'tagline': '推しを、飾る。',
        'description': '推しのイラストや写真をアクリルスタンドに。'
        '同人イベント、ファンアート展示に最適。',
        'long_description': 'アニメ、アイドル、VTuber、ペット。'
        'あなたの「推し」を美しいアクリルスタンドに。'
        '高精細UV印刷で細部まで鮮やかに再現。'
        '厚みのあるアクリルが高級感を演出し、デスクや棚を彩ります。'
        '1個からオーダー可能。同人イベントでの頒布にも。',
        'base_price': 2800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'image_file',
                    'label': 'イラスト・写真データ',
                    'required': True,
                    'accept': 'image/*',
                    'maxSizeMB': 50,
                    'note': 'PNG形式（透過背景）推奨。300dpi以上。',
                }
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 6,
    },
    {
        'id': 'you-cube-key',
        'master_id': 'cube',
        'category_id': 'you',
        'production_type': 'custom',
        'name': 'Key Block',
        'name_ja': 'キーブロック',
        'slug': 'key-block',
        'tagline': '大切な鍵を、飾る。',
        'description': '車の鍵、家の鍵など、大切な鍵を美しくディスプレイ。'
        '新車購入、新居祝いの記念に。',
        'long_description': '新車のスマートキー、新居の鍵、思い出のバイクキー。'
        '大切な鍵を美しくディスプレイするアクリルブロック。'
        '80mm〜100mm角、20mmの厚みが生む重厚感で、鍵がオブジェのような佇まいに。'
        '新車購入、新居祝い、免許取得の記念に最適です。',
        'base_price': 12800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'key_photo',
                    'label': '鍵の写真',
                    'required': True,
                    'accept': 'image/*',
                    'maxSizeMB': 50,
                    'note': '鍵の写真をお送りいただくか、現物をお預かりして製作します。',
                },
                {
                    'type': 'text',
                    'key': 'car_model',
                    'label': '車種・メーカー（任意）',
                    'required': False,
                    'placeholder': '例: BMW M3',
                    'maxLength': 50,
                },
                {
                    'type': 'date',
                    'key': 'purchase_date',
                    'label': '購入日・納車日（任意）',
                    'required': False,
                },
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 7,
    },
    {
        'id': 'you-round-pet',
        'master_id': 'round',
        'category_id': 'you',
        'production_type': 'custom',
        'name': 'Pet Memorial Round',
        'name_ja': 'ペットメモリアルラウンド',
        'slug': 'pet-memorial',
        'tagline': '大切な家族を、永遠に。',
        'description': '愛するペットの写真を円形アクリルに。'
        '虹の橋を渡った子も、ずっと一緒に。',
        'long_description': '大切な家族であるペットの思い出を、美しい円形アクリルに。'
        '在りし日の姿を高精細UV印刷で再現し、'
        '名前と日付を添えて、永遠の記念品に。'
        '虹の橋を渡った子の供養にも、今を共に生きる子の記録にも。',
        'base_price': 15000,
        'price_note': '直径200mm',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'upload_requirements': {
            'inputs': [
                {
                    'type': 'file',
                    'key': 'pet_photo',
                    'label': 'ペットの写真',
                    'required': True,
                    'accept': 'image/*',
                    'maxSizeMB': 50,
                    'note': '正面から撮影したお気に入りの写真を。300dpi以上推奨。',
                },
                {
                    'type': 'text',
                    'key': 'pet_name',
                    'label': 'ペットのお名前',
                    'required': True,
                    'placeholder': '例: ポチ',
                    'maxLength': 30,
                },
                {
                    'type': 'text',
                    'key': 'dates',
                    'label': '日付（任意）',
                    'required': False,
                    'placeholder': '例: 2015.4.1 - 2025.12.1',
                    'maxLength': 50,
                },
            ]
        },
        'is_active': True,
        'is_featured': False,
        'sort_order': 8,
    },
]

# =============================================================================
# 商品画像データ
# =============================================================================

PRODUCT_IMAGES = [
    # Shop products
    {
        'product_id': 'shop-cube-qr',
        'local_path': 'qr-cube/main.jpg',
        'alt': 'QRコードキューブ メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'shop-cube-qr',
        'local_path': 'qr-cube/02.jpg',
        'alt': 'QRコードキューブ 使用例',
        'is_main': False,
        'sort_order': 2,
    },
    {
        'product_id': 'shop-logo-cutout',
        'local_path': 'logo-cutout/main.jpg',
        'alt': 'ロゴカットアウト メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'shop-plate-price',
        'local_path': 'price-tag/main.jpg',
        'alt': 'プライスタグ メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'shop-a-stand',
        'local_path': 'a-stand/main.jpg',
        'alt': 'Aフレームサインスタンド メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'shop-plate-menu',
        'local_path': 'menu-stand/main.jpg',
        'alt': 'メニュースタンド メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'shop-stage-display',
        'local_path': 'display-riser/main.jpg',
        'alt': 'ディスプレイライザー メイン',
        'is_main': True,
        'sort_order': 1,
    },
    # Office products
    {
        'product_id': 'office-canvas-wall',
        'local_path': 'wall-sign/main.jpg',
        'alt': 'ウォールサイン メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'office-stage-tombstone',
        'local_path': 'tombstones/main.jpg',
        'alt': '成約記念モニュメント メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'office-plate-nameplate',
        'local_path': 'name-plate/main.jpg',
        'alt': '役員用ネームプレート メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'office-stage-award',
        'local_path': 'award/main.jpg',
        'alt': 'アワードトロフィー メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'office-plate-door',
        'local_path': 'door-sign/main.jpg',
        'alt': 'ドアサイン メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'office-logo-reception',
        'local_path': 'reception/main.jpg',
        'alt': 'レセプションサイン メイン',
        'is_main': True,
        'sort_order': 1,
    },
    # You products
    {
        'product_id': 'you-display-card',
        'local_path': 'card-display/main.jpg',
        'alt': 'トレカディスプレイ メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-arch-wedding',
        'local_path': 'wedding-board/main.jpg',
        'alt': 'ウェディングボード メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-puzzle-wedding',
        'local_path': 'wedding-puzzle/main.jpg',
        'alt': '結婚証明書パズル メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-canvas-baby',
        'local_path': 'baby-print/main.jpg',
        'alt': '手形足形アート メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-canvas-photo',
        'local_path': 'photo-frame/main.jpg',
        'alt': 'アクリルフォトフレーム メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-silhouette-stand',
        'local_path': 'acrylic-stand/main.jpg',
        'alt': 'アクリルスタンド メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-cube-key',
        'local_path': 'key-block/main.jpg',
        'alt': 'キーブロック メイン',
        'is_main': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-round-pet',
        'local_path': 'pet-memorial/main.jpg',
        'alt': 'ペットメモリアルラウンド メイン',
        'is_main': True,
        'sort_order': 1,
    },
]

# =============================================================================
# 商品オプションデータ
# =============================================================================

PRODUCT_OPTIONS = [
    # QR Cube
    {
        'product_id': 'shop-cube-qr',
        'name': 'サイズ',
        'is_required': True,
        'sort_order': 1,
    },
    {'product_id': 'shop-cube-qr', 'name': '厚み', 'is_required': True, 'sort_order': 2},
    {
        'product_id': 'shop-cube-qr',
        'name': '仕上げ',
        'is_required': True,
        'sort_order': 3,
    },
    # Wall Sign
    {
        'product_id': 'office-canvas-wall',
        'name': 'サイズ',
        'is_required': True,
        'sort_order': 1,
    },
    {
        'product_id': 'office-canvas-wall',
        'name': '素材',
        'is_required': True,
        'sort_order': 2,
    },
    {
        'product_id': 'office-canvas-wall',
        'name': '加工方法',
        'is_required': True,
        'sort_order': 3,
    },
    {
        'product_id': 'office-canvas-wall',
        'name': '化粧ビス',
        'is_required': True,
        'sort_order': 4,
    },
    # Card Display
    {
        'product_id': 'you-display-card',
        'name': 'カードサイズ',
        'is_required': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-display-card',
        'name': 'UVカット',
        'is_required': True,
        'sort_order': 2,
    },
    {
        'product_id': 'you-display-card',
        'name': 'フレームデザイン',
        'is_required': True,
        'sort_order': 3,
    },
    # Wedding Board
    {
        'product_id': 'you-arch-wedding',
        'name': 'サイズ',
        'is_required': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-arch-wedding',
        'name': '印刷色',
        'is_required': True,
        'sort_order': 2,
    },
    # Acrylic Stand
    {
        'product_id': 'you-silhouette-stand',
        'name': 'サイズ',
        'is_required': True,
        'sort_order': 1,
    },
    # Photo Frame
    {
        'product_id': 'you-canvas-photo',
        'name': 'サイズ',
        'is_required': True,
        'sort_order': 1,
    },
    {
        'product_id': 'you-canvas-photo',
        'name': '厚み',
        'is_required': True,
        'sort_order': 2,
    },
]

# =============================================================================
# 商品オプション値データ
# =============================================================================

PRODUCT_OPTION_VALUES = [
    # QR Cube - サイズ
    {
        'option_key': 'shop-cube-qr_サイズ',
        'label': '50mm角',
        'price_diff': 0,
        'description': 'コンパクト',
        'sort_order': 1,
    },
    {
        'option_key': 'shop-cube-qr_サイズ',
        'label': '60mm角',
        'price_diff': 2000,
        'description': '標準サイズ',
        'sort_order': 2,
    },
    {
        'option_key': 'shop-cube-qr_サイズ',
        'label': '80mm角',
        'price_diff': 6000,
        'description': '存在感あり',
        'sort_order': 3,
    },
    # QR Cube - 厚み
    {
        'option_key': 'shop-cube-qr_厚み',
        'label': '10mm',
        'price_diff': 0,
        'description': 'スタンダード',
        'sort_order': 1,
    },
    {
        'option_key': 'shop-cube-qr_厚み',
        'label': '15mm',
        'price_diff': 2000,
        'description': 'おすすめ',
        'sort_order': 2,
    },
    {
        'option_key': 'shop-cube-qr_厚み',
        'label': '20mm',
        'price_diff': 4000,
        'description': 'ブロック状',
        'sort_order': 3,
    },
    # QR Cube - 仕上げ
    {
        'option_key': 'shop-cube-qr_仕上げ',
        'label': '鏡面仕上げ',
        'price_diff': 0,
        'description': '高級感',
        'sort_order': 1,
    },
    {
        'option_key': 'shop-cube-qr_仕上げ',
        'label': 'マット仕上げ',
        'price_diff': 1000,
        'description': '落ち着いた印象',
        'sort_order': 2,
    },
    # Wall Sign - サイズ
    {
        'option_key': 'office-canvas-wall_サイズ',
        'label': 'A4 (210×297mm)',
        'price_diff': 0,
        'description': '',
        'sort_order': 1,
    },
    {
        'option_key': 'office-canvas-wall_サイズ',
        'label': 'A3 (297×420mm)',
        'price_diff': 14000,
        'description': '',
        'sort_order': 2,
    },
    {
        'option_key': 'office-canvas-wall_サイズ',
        'label': 'A2 (420×594mm)',
        'price_diff': 40000,
        'description': '',
        'sort_order': 3,
    },
    # Wall Sign - 素材
    {
        'option_key': 'office-canvas-wall_素材',
        'label': '透明アクリル',
        'price_diff': 0,
        'description': '壁が透ける',
        'sort_order': 1,
    },
    {
        'option_key': 'office-canvas-wall_素材',
        'label': '乳白アクリル',
        'price_diff': 3000,
        'description': '柔らかい印象',
        'sort_order': 2,
    },
    {
        'option_key': 'office-canvas-wall_素材',
        'label': '黒アクリル',
        'price_diff': 3000,
        'description': 'シャープな印象',
        'sort_order': 3,
    },
    # Wall Sign - 加工方法
    {
        'option_key': 'office-canvas-wall_加工方法',
        'label': 'UV印刷',
        'price_diff': 0,
        'description': 'フルカラー対応',
        'sort_order': 1,
    },
    {
        'option_key': 'office-canvas-wall_加工方法',
        'label': 'レーザー彫刻',
        'price_diff': 5000,
        'description': '高級感',
        'sort_order': 2,
    },
    {
        'option_key': 'office-canvas-wall_加工方法',
        'label': 'カッティング',
        'price_diff': 8000,
        'description': 'ロゴ形状',
        'sort_order': 3,
    },
    # Wall Sign - 化粧ビス
    {
        'option_key': 'office-canvas-wall_化粧ビス',
        'label': 'ステンレス',
        'price_diff': 0,
        'description': 'シルバー',
        'sort_order': 1,
    },
    {
        'option_key': 'office-canvas-wall_化粧ビス',
        'label': '真鍮',
        'price_diff': 2000,
        'description': 'ゴールド',
        'sort_order': 2,
    },
    {
        'option_key': 'office-canvas-wall_化粧ビス',
        'label': 'マットブラック',
        'price_diff': 1000,
        'description': 'モダン',
        'sort_order': 3,
    },
    # Card Display - カードサイズ
    {
        'option_key': 'you-display-card_カードサイズ',
        'label': 'スタンダード (63×88mm)',
        'price_diff': 0,
        'description': 'ポケカ・MTGなど',
        'sort_order': 1,
    },
    {
        'option_key': 'you-display-card_カードサイズ',
        'label': '日本サイズ (59×86mm)',
        'price_diff': 0,
        'description': '遊戯王など',
        'sort_order': 2,
    },
    {
        'option_key': 'you-display-card_カードサイズ',
        'label': 'オーバーサイズ',
        'price_diff': 3000,
        'description': '大型カード',
        'sort_order': 3,
    },
    # Card Display - UVカット
    {
        'option_key': 'you-display-card_UVカット',
        'label': 'UVカット99%',
        'price_diff': 0,
        'description': '標準仕様',
        'sort_order': 1,
    },
    {
        'option_key': 'you-display-card_UVカット',
        'label': 'UVカット70%',
        'price_diff': -2000,
        'description': 'コスト重視',
        'sort_order': 2,
    },
    # Card Display - フレームデザイン
    {
        'option_key': 'you-display-card_フレームデザイン',
        'label': 'クラシック',
        'price_diff': 0,
        'description': '上品な装飾',
        'sort_order': 1,
    },
    {
        'option_key': 'you-display-card_フレームデザイン',
        'label': 'ミニマル',
        'price_diff': 0,
        'description': 'シンプル',
        'sort_order': 2,
    },
    # Wedding Board - サイズ
    {
        'option_key': 'you-arch-wedding_サイズ',
        'label': 'A4',
        'price_diff': 0,
        'description': 'コンパクト',
        'sort_order': 1,
    },
    {
        'option_key': 'you-arch-wedding_サイズ',
        'label': 'A3',
        'price_diff': 5000,
        'description': 'スタンダード',
        'sort_order': 2,
    },
    {
        'option_key': 'you-arch-wedding_サイズ',
        'label': 'A2',
        'price_diff': 12000,
        'description': '大型',
        'sort_order': 3,
    },
    # Wedding Board - 印刷色
    {
        'option_key': 'you-arch-wedding_印刷色',
        'label': 'ホワイト',
        'price_diff': 0,
        'description': '',
        'sort_order': 1,
    },
    {
        'option_key': 'you-arch-wedding_印刷色',
        'label': 'ゴールド',
        'price_diff': 2000,
        'description': '',
        'sort_order': 2,
    },
    {
        'option_key': 'you-arch-wedding_印刷色',
        'label': 'シルバー',
        'price_diff': 2000,
        'description': '',
        'sort_order': 3,
    },
    # Acrylic Stand - サイズ
    {
        'option_key': 'you-silhouette-stand_サイズ',
        'label': 'SS (5cm)',
        'price_diff': 0,
        'description': 'ミニ',
        'sort_order': 1,
    },
    {
        'option_key': 'you-silhouette-stand_サイズ',
        'label': 'S (8cm)',
        'price_diff': 500,
        'description': 'コンパクト',
        'sort_order': 2,
    },
    {
        'option_key': 'you-silhouette-stand_サイズ',
        'label': 'M (12cm)',
        'price_diff': 1500,
        'description': 'スタンダード',
        'sort_order': 3,
    },
    {
        'option_key': 'you-silhouette-stand_サイズ',
        'label': 'L (15cm)',
        'price_diff': 2500,
        'description': 'ラージ',
        'sort_order': 4,
    },
    # Photo Frame - サイズ
    {
        'option_key': 'you-canvas-photo_サイズ',
        'label': 'L判 (89×127mm)',
        'price_diff': 0,
        'description': '',
        'sort_order': 1,
    },
    {
        'option_key': 'you-canvas-photo_サイズ',
        'label': '2L判 (127×178mm)',
        'price_diff': 3000,
        'description': '',
        'sort_order': 2,
    },
    {
        'option_key': 'you-canvas-photo_サイズ',
        'label': 'A4 (210×297mm)',
        'price_diff': 8000,
        'description': '',
        'sort_order': 3,
    },
    # Photo Frame - 厚み
    {
        'option_key': 'you-canvas-photo_厚み',
        'label': '10mm',
        'price_diff': 0,
        'description': 'スタンダード',
        'sort_order': 1,
    },
    {
        'option_key': 'you-canvas-photo_厚み',
        'label': '15mm',
        'price_diff': 2000,
        'description': '重厚感',
        'sort_order': 2,
    },
    {
        'option_key': 'you-canvas-photo_厚み',
        'label': '20mm',
        'price_diff': 4000,
        'description': '最上級',
        'sort_order': 3,
    },
]

# =============================================================================
# 商品スペックデータ
# =============================================================================

PRODUCT_SPECS = [
    # QR Cube
    {
        'product_id': 'shop-cube-qr',
        'label': 'サイズ',
        'value': '50mm / 60mm / 80mm 角',
        'sort_order': 1,
    },
    {
        'product_id': 'shop-cube-qr',
        'label': '厚み',
        'value': '10mm / 15mm / 20mm',
        'sort_order': 2,
    },
    {
        'product_id': 'shop-cube-qr',
        'label': '素材',
        'value': 'アクリル（透明）',
        'sort_order': 3,
    },
    {
        'product_id': 'shop-cube-qr',
        'label': '印刷',
        'value': 'UV印刷（裏面）',
        'sort_order': 4,
    },
    {
        'product_id': 'shop-cube-qr',
        'label': '仕上げ',
        'value': '側面鏡面仕上げ / マット仕上げ',
        'sort_order': 5,
    },
    # Wall Sign
    {
        'product_id': 'office-canvas-wall',
        'label': 'サイズ',
        'value': 'A4 / A3 / A2 / カスタム',
        'sort_order': 1,
    },
    {
        'product_id': 'office-canvas-wall',
        'label': '厚み',
        'value': '5mm / 8mm / 10mm',
        'sort_order': 2,
    },
    {
        'product_id': 'office-canvas-wall',
        'label': '素材',
        'value': 'アクリル（透明/乳白/黒）',
        'sort_order': 3,
    },
    {
        'product_id': 'office-canvas-wall',
        'label': '付属品',
        'value': '化粧ビス一式 / 取付説明書',
        'sort_order': 4,
    },
    # Card Display
    {
        'product_id': 'you-display-card',
        'label': '対応サイズ',
        'value': 'スタンダード / 日本サイズ / オーバーサイズ',
        'sort_order': 1,
    },
    {
        'product_id': 'you-display-card',
        'label': '素材',
        'value': 'アクリル（UVカット99%）',
        'sort_order': 2,
    },
    {
        'product_id': 'you-display-card',
        'label': '構造',
        'value': '3層構造',
        'sort_order': 3,
    },
    {
        'product_id': 'you-display-card',
        'label': '付属品',
        'value': 'スタンド / マイクロファイバークロス',
        'sort_order': 4,
    },
]

# =============================================================================
# 商品特長データ
# =============================================================================

PRODUCT_FEATURES = [
    # QR Cube
    {
        'product_id': 'shop-cube-qr',
        'title': '高級感のある佇まい',
        'description': '10mm以上の厚みが生み出す重厚感。'
        '店舗の雰囲気を損なわず、むしろ格上げします。',
        'sort_order': 1,
    },
    {
        'product_id': 'shop-cube-qr',
        'title': 'スキャンしやすい設計',
        'description': '適度な角度で自立し、お客様がスマホをかざしやすい高さを実現。',
        'sort_order': 2,
    },
    {
        'product_id': 'shop-cube-qr',
        'title': '長期間使える耐久性',
        'description': 'UV印刷は色褪せに強く、アクリル素材は割れにくい。長くお使いいただけます。',
        'sort_order': 3,
    },
    # Wall Sign
    {
        'product_id': 'office-canvas-wall',
        'title': '浮遊感のあるデザイン',
        'description': '壁から浮かせることで影が生まれ、立体感と奥行きを演出。',
        'sort_order': 1,
    },
    {
        'product_id': 'office-canvas-wall',
        'title': '壁素材を活かす透明感',
        'description': 'コンクリート、木、タイルなど、壁の素材感を活かしながらブランドを主張。',
        'sort_order': 2,
    },
    {
        'product_id': 'office-canvas-wall',
        'title': '設置も安心',
        'description': '化粧ビス一式と詳細な取付説明書が付属。施工業者様への指示もスムーズ。',
        'sort_order': 3,
    },
    # Card Display
    {
        'product_id': 'you-display-card',
        'title': 'UVカット99%',
        'description': '紫外線を99%カットし、大切なカードを日焼けから守ります。',
        'sort_order': 1,
    },
    {
        'product_id': 'you-display-card',
        'title': '3層構造で完全保護',
        'description': 'カードを3枚のアクリルで挟み込み、ホコリや傷から完全に保護。',
        'sort_order': 2,
    },
    {
        'product_id': 'you-display-card',
        'title': '美しい装飾彫刻',
        'description': 'カード枠にレーザー彫刻で繊細な装飾を施し、高級感を演出。',
        'sort_order': 3,
    },
]

# =============================================================================
# 商品FAQデータ
# =============================================================================

PRODUCT_FAQS = [
    # QR Cube
    {
        'product_id': 'shop-cube-qr',
        'question': 'QRコードのデータはどのように入稿すればよいですか？',
        'answer': 'ご注文時にQRコードのリンク先URLをご入力いただくだけでOKです。'
        '当方でQRコードを生成いたします。',
        'sort_order': 1,
    },
    {
        'product_id': 'shop-cube-qr',
        'question': '追加注文は可能ですか？',
        'answer': 'はい、同じデザインでの追加注文を承っております。'
        'データは1年間保管しておりますので、お気軽にご連絡ください。',
        'sort_order': 2,
    },
    # Wall Sign
    {
        'product_id': 'office-canvas-wall',
        'question': '取り付け工事は依頼できますか？',
        'answer': '申し訳ございませんが、取り付け工事は承っておりません。'
        '詳細な取付説明書をお付けしておりますので、施工業者様へご依頼ください。',
        'sort_order': 1,
    },
    {
        'product_id': 'office-canvas-wall',
        'question': '屋外に設置できますか？',
        'answer': '屋外対応オプション（+¥10,000〜）をご用意しております。'
        'UV耐性加工と防水処理を施します。',
        'sort_order': 2,
    },
    # Card Display
    {
        'product_id': 'you-display-card',
        'question': 'スリーブに入れたままでも入りますか？',
        'answer': 'インナースリーブ装着状態での収納を想定しています。'
        '厚手のスリーブやマグネットホルダーに入れた状態では入りません。',
        'sort_order': 1,
    },
    {
        'product_id': 'you-display-card',
        'question': 'PSA鑑定済みカードは入りますか？',
        'answer': 'PSAケースサイズ対応のディスプレイも別途ご用意しております。'
        'お問い合わせください。',
        'sort_order': 2,
    },
]

# =============================================================================
# 関連商品データ
# =============================================================================

PRODUCT_RELATIONS = [
    # QR Cube
    {
        'product_id': 'shop-cube-qr',
        'related_product_id': 'shop-logo-cutout',
        'sort_order': 1,
    },
    {
        'product_id': 'shop-cube-qr',
        'related_product_id': 'shop-plate-price',
        'sort_order': 2,
    },
    {'product_id': 'shop-cube-qr', 'related_product_id': 'shop-a-stand', 'sort_order': 3},
    # Wall Sign
    {
        'product_id': 'office-canvas-wall',
        'related_product_id': 'office-stage-tombstone',
        'sort_order': 1,
    },
    {
        'product_id': 'office-canvas-wall',
        'related_product_id': 'office-plate-door',
        'sort_order': 2,
    },
    {
        'product_id': 'office-canvas-wall',
        'related_product_id': 'office-logo-reception',
        'sort_order': 3,
    },
    # Card Display
    {
        'product_id': 'you-display-card',
        'related_product_id': 'you-silhouette-stand',
        'sort_order': 1,
    },
    {
        'product_id': 'you-display-card',
        'related_product_id': 'you-canvas-photo',
        'sort_order': 2,
    },
    {
        'product_id': 'you-display-card',
        'related_product_id': 'you-cube-key',
        'sort_order': 3,
    },
]
