"""商品シードデータ"""

from datetime import datetime

# =============================================================================
# 商品データ
# =============================================================================

PRODUCTS = [
    # ===== For Shop =====
    {
        'id': 'qr-cube',
        'category_id': 'shop',
        'name': 'QR Code Cube',
        'name_ja': 'QRコードキューブ',
        'slug': 'qr-cube',
        'tagline': 'あなたのQRを、アートに。',
        'description': 'Instagram、決済用QR、Wi-Fi案内など、あらゆるQRコードを高級感あるキューブに。レジ横やテーブルに置くだけで、店舗の格が上がります。',
        'long_description': '店舗のレジ横やテーブルに置くだけで、空間の格が上がる。QRコードという機能的なものを、インテリアとして昇華させたプロダクトです。裏面からのUV印刷により、QRコードは透明なアクリル越しに美しく見え、側面の鏡面仕上げが高級感を演出します。Instagram、PayPay・楽天ペイなどの決済QR、Wi-Fiパスワード、Google口コミへの誘導など、様々な用途にお使いいただけます。',
        'base_price': 8800,
        'price_note': 'サイズ・オプションにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'qr',
        'upload_note': 'QRコードの画像データ（PNG/JPG）またはリンク先URLをお送りください',
        'is_active': True,
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'logo-cutout',
        'category_id': 'shop',
        'name': 'Logo Cutout Object',
        'name_ja': 'ロゴカットアウト',
        'slug': 'logo-cutout',
        'tagline': 'ブランドを、立体化する。',
        'description': 'あなたのブランドロゴをそのままの形で切り出し。受付やレジ横に置けば、一目でブランドが伝わります。',
        'long_description': 'ブランドロゴをレーザーカットで精密に切り出し、自立するオブジェに。透明アクリルの美しさと、10mm以上の厚みが生む重厚感で、ブランドの存在感を最大限に引き出します。受付カウンター、レジ横、撮影スポットなど、ブランドを印象づけたい場所に。',
        'base_price': 12800,
        'price_note': 'サイズ・複雑さにより変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'requires_upload': True,
        'upload_type': 'logo',
        'upload_note': 'AI, EPS, PDF, SVG形式のベクターデータを推奨',
        'is_active': True,
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'price-tag',
        'category_id': 'shop',
        'name': 'Luxury Price Tag',
        'name_ja': 'プライスタグ',
        'slug': 'price-tag',
        'tagline': '商品の価値を、引き立てる。',
        'description': 'ジュエリーや時計など、高級商材にふさわしい重厚なプライスカード。商品の価値をさらに引き立てます。',
        'long_description': '紙のプライスカードでは表現できない高級感。10mmの厚みを持つアクリル製プライスタグは、ジュエリー、時計、バッグなどの高級商材にふさわしい佇まい。UV印刷で価格やスペックを美しく表示し、商品の価値を最大限に引き立てます。',
        'base_price': 3800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'text',
        'upload_note': '商品名・価格・スペック等をお知らせください',
        'is_active': True,
        'is_featured': False,
        'sort_order': 3,
    },
    {
        'id': 'menu-stand',
        'category_id': 'shop',
        'name': 'Menu Stand',
        'name_ja': 'メニュースタンド',
        'slug': 'menu-stand',
        'tagline': 'テーブルを、彩る。',
        'description': 'カフェやレストランのテーブルを彩るメニュースタンド。透明感が清潔さと高級感を演出します。',
        'long_description': 'カフェ、レストラン、バーのテーブルに。透明アクリルのメニュースタンドは、清潔感と高級感を両立。A6〜A4サイズに対応し、差し替えも簡単。両面使用可能なタイプもご用意しています。',
        'base_price': 6800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': False,
        'upload_type': None,
        'upload_note': '',
        'is_active': True,
        'is_featured': False,
        'sort_order': 4,
    },
    {
        'id': 'display-riser',
        'category_id': 'shop',
        'name': 'Display Riser',
        'name_ja': 'ディスプレイライザー',
        'slug': 'display-riser',
        'tagline': '商品を、際立たせる。',
        'description': '商品を美しく見せる階段状のディスプレイ台。化粧品、アクセサリー、フィギュアなど様々な商品に対応。',
        'long_description': '階段状のディスプレイ台で、商品に高低差をつけて美しく陳列。化粧品、アクセサリー、フィギュア、食品サンプルなど、様々な商品の魅力を引き出します。透明アクリルは商品を邪魔せず、どんな世界観にも馴染みます。',
        'base_price': 9800,
        'price_note': 'サイズ・段数により変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'requires_upload': False,
        'upload_type': None,
        'upload_note': '',
        'is_active': True,
        'is_featured': False,
        'sort_order': 5,
    },
    {
        'id': 'sign-holder',
        'category_id': 'shop',
        'name': 'Sign Holder',
        'name_ja': 'サインホルダー',
        'slug': 'sign-holder',
        'tagline': '案内を、スタイリッシュに。',
        'description': 'OPEN/CLOSED、予約席、撮影OKなど、店舗に必要な各種サインを高級感あるアクリルで。',
        'long_description': 'OPEN/CLOSED、予約席、撮影OK、Wi-Fiパスワードなど、店舗運営に必要なサインをアクリルで。テーブルサインから卓上スタンドまで、様々なタイプをご用意。既製デザインからオリジナルまで対応します。',
        'base_price': 4800,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': False,
        'upload_type': None,
        'upload_note': '',
        'is_active': True,
        'is_featured': False,
        'sort_order': 6,
    },
    # ===== For Office =====
    {
        'id': 'wall-sign',
        'category_id': 'office',
        'name': 'Floating Wall Sign',
        'name_ja': 'フローティングウォールサイン',
        'slug': 'wall-sign',
        'tagline': 'エントランスを、格上げする。',
        'description': 'エントランスを格上げする浮遊感のある社名サイン。化粧ビスで壁から浮かせることで、高級感と立体感を演出。',
        'long_description': '企業の顔となるエントランスサイン。壁から15mm〜30mm浮かせて設置することで、影が生まれ、立体感と高級感を演出します。透明アクリルに社名やロゴを配置することで、壁の素材感を活かしながら、ブランドを主張できます。付属の化粧ビス（ステンレス/真鍮から選択可）で、施工業者様でも簡単に設置いただけます。',
        'base_price': 38000,
        'price_note': 'A4サイズ・10mm厚の場合',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'requires_upload': True,
        'upload_type': 'logo',
        'upload_note': 'AI, EPS, PDF, SVGなどのベクターデータ推奨。JPG/PNGは300dpi以上',
        'is_active': True,
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'tombstones',
        'category_id': 'office',
        'name': 'Deal Tombstones',
        'name_ja': '成約記念モニュメント',
        'slug': 'tombstones',
        'tagline': '節目を、刻む。',
        'description': '上場記念、M&A成立、大型プロジェクト完了など、企業の節目を刻む記念盾。多層構造で立体的なデザインも可能。',
        'long_description': 'IPO、M&A成立、大型ファイナンス、プロジェクト完了。企業の重要な節目を形に残す記念盾。多層構造のアクリルで立体的なデザインを実現し、関係者への感謝と達成の証を美しく刻みます。投資銀行、証券会社、法律事務所からの実績多数。',
        'base_price': 28000,
        'price_note': 'デザイン・サイズにより変動',
        'lead_time_days': 10,
        'lead_time_note': '10営業日〜',
        'requires_upload': True,
        'upload_type': 'logo',
        'upload_note': '企業ロゴ・案件名・日付等をお知らせください',
        'is_active': True,
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'name-plate',
        'category_id': 'office',
        'name': 'Desk Name Plate',
        'name_ja': '役員用ネームプレート',
        'slug': 'name-plate',
        'tagline': 'デスクに、威厳を。',
        'description': '社長室、役員デスクにふさわしい重厚なネームプレート。幾何学的なカッティングでモダンな印象に。',
        'long_description': '社長室、役員室、応接室のデスクに。15mm〜20mmの厚みを持つアクリル製ネームプレートは、重厚感と透明感を両立。幾何学的なカッティングでモダンな印象を演出します。名前、役職を美しくレーザー彫刻。',
        'base_price': 18000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'text',
        'upload_note': '名前・役職をお知らせください',
        'is_active': True,
        'is_featured': False,
        'sort_order': 3,
    },
    {
        'id': 'award',
        'category_id': 'office',
        'name': 'Award Trophy',
        'name_ja': 'アワードトロフィー',
        'slug': 'award',
        'tagline': '功績を、称える。',
        'description': '社内表彰、MVP、永年勤続など、従業員のモチベーションを高める美しいトロフィー。',
        'long_description': 'MVP表彰、営業成績優秀者、永年勤続、プロジェクト完了。従業員の功績を称え、モチベーションを高めるアワードトロフィー。透明アクリルの美しさと、カスタムデザインで、受賞者の誇りとなる一品を。毎年のアワードにも対応いたします。',
        'base_price': 15000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'requires_upload': True,
        'upload_type': 'logo',
        'upload_note': '企業ロゴ・受賞者名・表彰理由等をお知らせください',
        'is_active': True,
        'is_featured': True,
        'sort_order': 4,
    },
    {
        'id': 'door-sign',
        'category_id': 'office',
        'name': 'Door Sign',
        'name_ja': 'ドアサイン',
        'slug': 'door-sign',
        'tagline': '空間を、導く。',
        'description': '会議室、役員室、部署名など、オフィス内のサインを統一感あるデザインで。',
        'long_description': '会議室A、応接室、社長室、経理部。オフィス内の部屋名・部署名サインを統一感あるアクリルで。壁付け、ドア用、スタンドタイプなど設置場所に合わせてご提案。ピクトグラム対応で、来客にもわかりやすいサインを実現します。',
        'base_price': 8800,
        'price_note': 'サイズ・数量により変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'text',
        'upload_note': '部屋名・部署名等をお知らせください',
        'is_active': True,
        'is_featured': False,
        'sort_order': 5,
    },
    {
        'id': 'reception',
        'category_id': 'office',
        'name': 'Reception Sign',
        'name_ja': 'レセプションサイン',
        'slug': 'reception',
        'tagline': '来客を、迎える。',
        'description': '受付カウンターに設置するウェルカムサイン。来客の第一印象を決める重要なアイテム。',
        'long_description': '受付カウンターは企業の顔。来客が最初に目にするレセプションサインで、第一印象を決めます。社名ロゴを美しく配置し、ウェルカムメッセージを添えて。卓上タイプ、壁掛けタイプなど、設置場所に合わせてご提案します。',
        'base_price': 22000,
        'price_note': 'サイズ・デザインにより変動',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'requires_upload': True,
        'upload_type': 'logo',
        'upload_note': '企業ロゴ・ウェルカムメッセージ等をお知らせください',
        'is_active': True,
        'is_featured': False,
        'sort_order': 6,
    },
    # ===== For You =====
    {
        'id': 'card-display',
        'category_id': 'you',
        'name': 'Trading Card Display',
        'name_ja': 'トレカディスプレイ',
        'slug': 'card-display',
        'tagline': '大切な1枚を、博物館レベルで。',
        'description': 'ポケカ、遊戯王、MTGなど、大切なカードを博物館レベルで展示。UVカットアクリルで日焼けからも守ります。',
        'long_description': '高額カード、思い出のカード、推しのカード。大切な1枚を、最高の状態で展示・保管するためのディスプレイケースです。3層構造のアクリルがカードを完全に包み込み、ホコリ、傷、そしてUVカットアクリルにより日焼けからも守ります。カード枠には繊細なレーザー彫刻で装飾を施し、まるで美術館の展示のような佇まいを実現しました。',
        'base_price': 12800,
        'price_note': 'スタンダードサイズ・UVカット仕様',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': False,
        'upload_type': None,
        'upload_note': '',
        'is_active': True,
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'wedding-board',
        'category_id': 'you',
        'name': 'Wedding Welcome Board',
        'name_ja': 'ウェディングボード',
        'slug': 'wedding-board',
        'tagline': '二人の門出を、彩る。',
        'description': '透け感を活かしたエレガントなウェルカムボード。式の後もインテリアとして飾れます。',
        'long_description': '「Welcome to our wedding」。結婚式のエントランスを華やかに彩るアクリル製ウェルカムボード。透明なアクリルに白やゴールドの文字が映え、写真映えも抜群。式の後もインテリアとして、二人の思い出を永遠に飾れます。A3〜A2サイズの大判対応。',
        'base_price': 25000,
        'price_note': 'A3サイズ〜',
        'lead_time_days': 10,
        'lead_time_note': '10営業日〜',
        'requires_upload': True,
        'upload_type': 'text',
        'upload_note': 'お二人のお名前、挙式日等をお知らせください',
        'is_active': True,
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'baby-print',
        'category_id': 'you',
        'name': 'Baby Hand/Foot Print',
        'name_ja': '手形足形アート',
        'slug': 'baby-print',
        'tagline': '成長の証を、永遠に。',
        'description': '赤ちゃんの手形・足形を実寸大でレーザー彫刻。出産祝い、内祝いに最適な一生の宝物。',
        'long_description': '赤ちゃんの小さな手形・足形を、実寸大でアクリルにレーザー彫刻。紙や粘土とは違い、劣化せず永遠に美しさを保ちます。お名前、生年月日、出生時の体重・身長も一緒に刻印可能。出産祝い、内祝い、祖父母へのプレゼントに最適な、一生の宝物になります。',
        'base_price': 18000,
        'price_note': 'A4サイズ',
        'lead_time_days': 7,
        'lead_time_note': '7営業日〜',
        'requires_upload': True,
        'upload_type': 'photo',
        'upload_note': '手形・足形の写真またはスキャンデータ（実寸大）をお送りください',
        'is_active': True,
        'is_featured': True,
        'sort_order': 3,
    },
    {
        'id': 'photo-frame',
        'category_id': 'you',
        'name': 'Acrylic Photo Frame',
        'name_ja': 'アクリルフォトフレーム',
        'slug': 'photo-frame',
        'tagline': '思い出を、永遠に。',
        'description': '写真をアクリルに封入し、永遠に色褪せない思い出に。結婚式、家族写真、ペットの写真に。',
        'long_description': '大切な写真をアクリルに封入し、永遠に色褪せない思い出に。結婚式、家族写真、ペットの写真、旅行の思い出。10mm〜20mmの厚みが生む重厚感で、写真が美術品のような佇まいに。磁石式で写真の入れ替えも簡単なタイプもご用意。',
        'base_price': 9800,
        'price_note': 'L判サイズ〜',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'photo',
        'upload_note': 'JPG, PNG形式の画像（300dpi以上推奨）をお送りください',
        'is_active': True,
        'is_featured': False,
        'sort_order': 4,
    },
    {
        'id': 'acrylic-stand',
        'category_id': 'you',
        'name': 'Acrylic Stand',
        'name_ja': 'アクリルスタンド',
        'slug': 'acrylic-stand',
        'tagline': '推しを、飾る。',
        'description': '推しのイラストや写真をアクリルスタンドに。同人イベント、ファンアート展示に最適。',
        'long_description': 'アニメ、アイドル、VTuber、ペット。あなたの「推し」を美しいアクリルスタンドに。高精細UV印刷で細部まで鮮やかに再現。厚みのあるアクリルが高級感を演出し、デスクや棚を彩ります。1個からオーダー可能。同人イベントでの頒布にも。',
        'base_price': 2800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'photo',
        'upload_note': 'JPG, PNG形式の画像（300dpi以上推奨）をお送りください',
        'is_active': True,
        'is_featured': False,
        'sort_order': 5,
    },
    {
        'id': 'key-block',
        'category_id': 'you',
        'name': 'Key Block',
        'name_ja': 'キーブロック',
        'slug': 'key-block',
        'tagline': '大切な鍵を、飾る。',
        'description': '車の鍵、家の鍵など、大切な鍵を美しくディスプレイ。新車購入、新居祝いの記念に。',
        'long_description': '新車のスマートキー、新居の鍵、思い出のバイクキー。大切な鍵を美しくディスプレイするアクリルブロック。80mm〜100mm角、20mmの厚みが生む重厚感で、鍵がオブジェのような佇まいに。新車購入、新居祝い、免許取得の記念に最適です。',
        'base_price': 8800,
        'price_note': 'サイズにより変動',
        'lead_time_days': 5,
        'lead_time_note': '5営業日〜',
        'requires_upload': True,
        'upload_type': 'photo',
        'upload_note': '鍵の写真をお送りいただくか、現物をお預かりして製作します',
        'is_active': True,
        'is_featured': False,
        'sort_order': 6,
    },
]

# =============================================================================
# 商品画像データ
# =============================================================================

PRODUCT_IMAGES = [
    # QR Cube
    {'product_id': 'qr-cube', 'url': '/images/products/qr-cube-1.jpg', 'alt': 'QRコードキューブ メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'qr-cube', 'url': '/images/products/qr-cube-2.jpg', 'alt': 'QRコードキューブ 使用例', 'is_main': False, 'sort_order': 2},
    {'product_id': 'qr-cube', 'url': '/images/products/qr-cube-3.jpg', 'alt': 'QRコードキューブ サイズ比較', 'is_main': False, 'sort_order': 3},
    # Logo Cutout
    {'product_id': 'logo-cutout', 'url': '/images/products/logo-cutout-1.jpg', 'alt': 'ロゴカットアウト メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'logo-cutout', 'url': '/images/products/logo-cutout-2.jpg', 'alt': 'ロゴカットアウト 使用例', 'is_main': False, 'sort_order': 2},
    # Price Tag
    {'product_id': 'price-tag', 'url': '/images/products/price-tag-1.jpg', 'alt': 'プライスタグ メイン', 'is_main': True, 'sort_order': 1},
    # Menu Stand
    {'product_id': 'menu-stand', 'url': '/images/products/menu-stand-1.jpg', 'alt': 'メニュースタンド メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'menu-stand', 'url': '/images/products/menu-stand-2.jpg', 'alt': 'メニュースタンド 使用例', 'is_main': False, 'sort_order': 2},
    # Display Riser
    {'product_id': 'display-riser', 'url': '/images/products/display-riser-1.jpg', 'alt': 'ディスプレイライザー メイン', 'is_main': True, 'sort_order': 1},
    # Sign Holder
    {'product_id': 'sign-holder', 'url': '/images/products/sign-holder-1.jpg', 'alt': 'サインホルダー メイン', 'is_main': True, 'sort_order': 1},
    # Wall Sign
    {'product_id': 'wall-sign', 'url': '/images/products/wall-sign-1.jpg', 'alt': 'ウォールサイン メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'wall-sign', 'url': '/images/products/wall-sign-2.jpg', 'alt': 'ウォールサイン 設置例', 'is_main': False, 'sort_order': 2},
    # Tombstones
    {'product_id': 'tombstones', 'url': '/images/products/tombstones-1.jpg', 'alt': '成約記念モニュメント メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'tombstones', 'url': '/images/products/tombstones-2.jpg', 'alt': '成約記念モニュメント バリエーション', 'is_main': False, 'sort_order': 2},
    # Name Plate
    {'product_id': 'name-plate', 'url': '/images/products/name-plate-1.jpg', 'alt': '役員用ネームプレート メイン', 'is_main': True, 'sort_order': 1},
    # Award
    {'product_id': 'award', 'url': '/images/products/award-1.jpg', 'alt': 'アワードトロフィー メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'award', 'url': '/images/products/award-2.jpg', 'alt': 'アワードトロフィー バリエーション', 'is_main': False, 'sort_order': 2},
    # Door Sign
    {'product_id': 'door-sign', 'url': '/images/products/door-sign-1.jpg', 'alt': 'ドアサイン メイン', 'is_main': True, 'sort_order': 1},
    # Reception
    {'product_id': 'reception', 'url': '/images/products/reception-1.jpg', 'alt': 'レセプションサイン メイン', 'is_main': True, 'sort_order': 1},
    # Card Display
    {'product_id': 'card-display', 'url': '/images/products/card-display-1.jpg', 'alt': 'トレカディスプレイ メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'card-display', 'url': '/images/products/card-display-2.jpg', 'alt': 'トレカディスプレイ 使用例', 'is_main': False, 'sort_order': 2},
    # Wedding Board
    {'product_id': 'wedding-board', 'url': '/images/products/wedding-board-1.jpg', 'alt': 'ウェディングボード メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'wedding-board', 'url': '/images/products/wedding-board-2.jpg', 'alt': 'ウェディングボード デザイン例', 'is_main': False, 'sort_order': 2},
    # Baby Print
    {'product_id': 'baby-print', 'url': '/images/products/baby-print-1.jpg', 'alt': '手形足形アート メイン', 'is_main': True, 'sort_order': 1},
    # Photo Frame
    {'product_id': 'photo-frame', 'url': '/images/products/photo-frame-1.jpg', 'alt': 'アクリルフォトフレーム メイン', 'is_main': True, 'sort_order': 1},
    # Acrylic Stand
    {'product_id': 'acrylic-stand', 'url': '/images/products/acrylic-stand-1.jpg', 'alt': 'アクリルスタンド メイン', 'is_main': True, 'sort_order': 1},
    {'product_id': 'acrylic-stand', 'url': '/images/products/acrylic-stand-2.jpg', 'alt': 'アクリルスタンド サイズ展開', 'is_main': False, 'sort_order': 2},
    # Key Block
    {'product_id': 'key-block', 'url': '/images/products/key-block-1.jpg', 'alt': 'キーブロック メイン', 'is_main': True, 'sort_order': 1},
]

# =============================================================================
# 商品オプションデータ
# =============================================================================

PRODUCT_OPTIONS = [
    # QR Cube
    {'product_id': 'qr-cube', 'name': 'サイズ', 'is_required': True, 'sort_order': 1},
    {'product_id': 'qr-cube', 'name': '厚み', 'is_required': True, 'sort_order': 2},
    {'product_id': 'qr-cube', 'name': '仕上げ', 'is_required': True, 'sort_order': 3},
    # Wall Sign
    {'product_id': 'wall-sign', 'name': 'サイズ', 'is_required': True, 'sort_order': 1},
    {'product_id': 'wall-sign', 'name': '素材', 'is_required': True, 'sort_order': 2},
    {'product_id': 'wall-sign', 'name': '加工方法', 'is_required': True, 'sort_order': 3},
    {'product_id': 'wall-sign', 'name': '化粧ビス', 'is_required': True, 'sort_order': 4},
    # Card Display
    {'product_id': 'card-display', 'name': 'カードサイズ', 'is_required': True, 'sort_order': 1},
    {'product_id': 'card-display', 'name': 'UVカット', 'is_required': True, 'sort_order': 2},
    {'product_id': 'card-display', 'name': 'フレームデザイン', 'is_required': True, 'sort_order': 3},
    {'product_id': 'card-display', 'name': 'スタンド', 'is_required': False, 'sort_order': 4},
    # Wedding Board
    {'product_id': 'wedding-board', 'name': 'サイズ', 'is_required': True, 'sort_order': 1},
    {'product_id': 'wedding-board', 'name': '印刷色', 'is_required': True, 'sort_order': 2},
    # Acrylic Stand
    {'product_id': 'acrylic-stand', 'name': 'サイズ', 'is_required': True, 'sort_order': 1},
]

# =============================================================================
# 商品オプション値データ
# =============================================================================

# option_keyは「{product_id}_{option_name}」形式で指定
PRODUCT_OPTION_VALUES = [
    # QR Cube - サイズ
    {'option_key': 'qr-cube_サイズ', 'label': '50mm角', 'price_diff': 0, 'description': 'コンパクト', 'sort_order': 1},
    {'option_key': 'qr-cube_サイズ', 'label': '60mm角', 'price_diff': 2000, 'description': '標準サイズ', 'sort_order': 2},
    {'option_key': 'qr-cube_サイズ', 'label': '80mm角', 'price_diff': 6000, 'description': '存在感あり', 'sort_order': 3},
    # QR Cube - 厚み
    {'option_key': 'qr-cube_厚み', 'label': '10mm', 'price_diff': 0, 'description': 'スタンダード', 'sort_order': 1},
    {'option_key': 'qr-cube_厚み', 'label': '15mm', 'price_diff': 2000, 'description': 'おすすめ', 'sort_order': 2},
    {'option_key': 'qr-cube_厚み', 'label': '20mm', 'price_diff': 4000, 'description': 'ブロック状', 'sort_order': 3},
    # QR Cube - 仕上げ
    {'option_key': 'qr-cube_仕上げ', 'label': '鏡面仕上げ', 'price_diff': 0, 'description': '高級感', 'sort_order': 1},
    {'option_key': 'qr-cube_仕上げ', 'label': 'マット仕上げ', 'price_diff': 1000, 'description': '落ち着いた印象', 'sort_order': 2},
    # Wall Sign - サイズ
    {'option_key': 'wall-sign_サイズ', 'label': 'A4 (210×297mm)', 'price_diff': 0, 'description': '', 'sort_order': 1},
    {'option_key': 'wall-sign_サイズ', 'label': 'A3 (297×420mm)', 'price_diff': 14000, 'description': '', 'sort_order': 2},
    {'option_key': 'wall-sign_サイズ', 'label': 'A2 (420×594mm)', 'price_diff': 40000, 'description': '', 'sort_order': 3},
    # Wall Sign - 素材
    {'option_key': 'wall-sign_素材', 'label': '透明アクリル', 'price_diff': 0, 'description': '壁が透ける', 'sort_order': 1},
    {'option_key': 'wall-sign_素材', 'label': '乳白アクリル', 'price_diff': 3000, 'description': '柔らかい印象', 'sort_order': 2},
    {'option_key': 'wall-sign_素材', 'label': '黒アクリル', 'price_diff': 3000, 'description': 'シャープな印象', 'sort_order': 3},
    # Wall Sign - 加工方法
    {'option_key': 'wall-sign_加工方法', 'label': 'UV印刷', 'price_diff': 0, 'description': 'フルカラー対応', 'sort_order': 1},
    {'option_key': 'wall-sign_加工方法', 'label': 'レーザー彫刻', 'price_diff': 5000, 'description': '高級感', 'sort_order': 2},
    {'option_key': 'wall-sign_加工方法', 'label': 'カッティング', 'price_diff': 8000, 'description': 'ロゴ形状', 'sort_order': 3},
    # Wall Sign - 化粧ビス
    {'option_key': 'wall-sign_化粧ビス', 'label': 'ステンレス', 'price_diff': 0, 'description': 'シルバー', 'sort_order': 1},
    {'option_key': 'wall-sign_化粧ビス', 'label': '真鍮', 'price_diff': 2000, 'description': 'ゴールド', 'sort_order': 2},
    {'option_key': 'wall-sign_化粧ビス', 'label': 'ブラック', 'price_diff': 1000, 'description': 'マットブラック', 'sort_order': 3},
    # Card Display - カードサイズ
    {'option_key': 'card-display_カードサイズ', 'label': 'スタンダード (63×88mm)', 'price_diff': 0, 'description': 'ポケカ・MTGなど', 'sort_order': 1},
    {'option_key': 'card-display_カードサイズ', 'label': '日本サイズ (59×86mm)', 'price_diff': 0, 'description': '遊戯王など', 'sort_order': 2},
    {'option_key': 'card-display_カードサイズ', 'label': 'オーバーサイズ', 'price_diff': 3000, 'description': '大型カード', 'sort_order': 3},
    # Card Display - UVカット
    {'option_key': 'card-display_UVカット', 'label': 'UVカット99%', 'price_diff': 0, 'description': '標準仕様', 'sort_order': 1},
    {'option_key': 'card-display_UVカット', 'label': 'UVカット70%', 'price_diff': -2000, 'description': 'コスト重視', 'sort_order': 2},
    # Card Display - フレームデザイン
    {'option_key': 'card-display_フレームデザイン', 'label': 'クラシック', 'price_diff': 0, 'description': '上品な装飾', 'sort_order': 1},
    {'option_key': 'card-display_フレームデザイン', 'label': 'ミニマル', 'price_diff': 0, 'description': 'シンプル', 'sort_order': 2},
    {'option_key': 'card-display_フレームデザイン', 'label': 'カスタム', 'price_diff': 5000, 'description': 'オリジナルデザイン', 'sort_order': 3},
    # Card Display - スタンド
    {'option_key': 'card-display_スタンド', 'label': '透明', 'price_diff': 0, 'description': '標準付属', 'sort_order': 1},
    {'option_key': 'card-display_スタンド', 'label': 'ブラック', 'price_diff': 500, 'description': '', 'sort_order': 2},
    {'option_key': 'card-display_スタンド', 'label': 'ウッド調', 'price_diff': 1500, 'description': '高級感', 'sort_order': 3},
    # Wedding Board - サイズ
    {'option_key': 'wedding-board_サイズ', 'label': 'A4', 'price_diff': 0, 'description': 'コンパクト', 'sort_order': 1},
    {'option_key': 'wedding-board_サイズ', 'label': 'A3', 'price_diff': 5000, 'description': 'スタンダード', 'sort_order': 2},
    {'option_key': 'wedding-board_サイズ', 'label': 'A2', 'price_diff': 12000, 'description': '大型', 'sort_order': 3},
    # Wedding Board - 印刷色
    {'option_key': 'wedding-board_印刷色', 'label': 'ホワイト', 'price_diff': 0, 'description': '', 'sort_order': 1},
    {'option_key': 'wedding-board_印刷色', 'label': 'ゴールド', 'price_diff': 2000, 'description': '', 'sort_order': 2},
    {'option_key': 'wedding-board_印刷色', 'label': 'シルバー', 'price_diff': 2000, 'description': '', 'sort_order': 3},
    # Acrylic Stand - サイズ
    {'option_key': 'acrylic-stand_サイズ', 'label': 'SS (5cm)', 'price_diff': 0, 'description': 'ミニ', 'sort_order': 1},
    {'option_key': 'acrylic-stand_サイズ', 'label': 'S (8cm)', 'price_diff': 500, 'description': 'コンパクト', 'sort_order': 2},
    {'option_key': 'acrylic-stand_サイズ', 'label': 'M (12cm)', 'price_diff': 1500, 'description': 'スタンダード', 'sort_order': 3},
    {'option_key': 'acrylic-stand_サイズ', 'label': 'L (15cm)', 'price_diff': 2500, 'description': 'ラージ', 'sort_order': 4},
]

# =============================================================================
# 商品スペックデータ
# =============================================================================

PRODUCT_SPECS = [
    # QR Cube
    {'product_id': 'qr-cube', 'label': 'サイズ', 'value': '50mm / 60mm / 80mm 角', 'sort_order': 1},
    {'product_id': 'qr-cube', 'label': '厚み', 'value': '10mm / 15mm / 20mm（ブロック状）', 'sort_order': 2},
    {'product_id': 'qr-cube', 'label': '素材', 'value': 'アクリル（透明）', 'sort_order': 3},
    {'product_id': 'qr-cube', 'label': '印刷', 'value': 'UV印刷（裏面）', 'sort_order': 4},
    {'product_id': 'qr-cube', 'label': '仕上げ', 'value': '側面鏡面仕上げ', 'sort_order': 5},
    {'product_id': 'qr-cube', 'label': '付属品', 'value': '滑り止めシート', 'sort_order': 6},
    # Wall Sign
    {'product_id': 'wall-sign', 'label': 'サイズ', 'value': 'A4 / A3 / A2 / カスタム', 'sort_order': 1},
    {'product_id': 'wall-sign', 'label': '厚み', 'value': '5mm / 8mm / 10mm', 'sort_order': 2},
    {'product_id': 'wall-sign', 'label': '素材', 'value': 'アクリル（透明/乳白/黒）', 'sort_order': 3},
    {'product_id': 'wall-sign', 'label': '印刷/加工', 'value': 'UV印刷 / レーザー彫刻 / カッティング', 'sort_order': 4},
    {'product_id': 'wall-sign', 'label': '付属品', 'value': '化粧ビス一式 / 取付説明書', 'sort_order': 5},
    {'product_id': 'wall-sign', 'label': '浮かせ幅', 'value': '15mm / 20mm / 30mm', 'sort_order': 6},
    # Card Display
    {'product_id': 'card-display', 'label': '対応カードサイズ', 'value': 'スタンダード (63×88mm) / 日本サイズ (59×86mm)', 'sort_order': 1},
    {'product_id': 'card-display', 'label': '外寸', 'value': '約 100×130×15mm', 'sort_order': 2},
    {'product_id': 'card-display', 'label': '素材', 'value': 'アクリル（UVカット99%）', 'sort_order': 3},
    {'product_id': 'card-display', 'label': '構造', 'value': '3層構造（前面・中間・背面）', 'sort_order': 4},
    {'product_id': 'card-display', 'label': '総厚', 'value': '15mm以上', 'sort_order': 5},
    {'product_id': 'card-display', 'label': '付属品', 'value': 'スタンド / マイクロファイバークロス', 'sort_order': 6},
]

# =============================================================================
# 商品特長データ
# =============================================================================

PRODUCT_FEATURES = [
    # QR Cube
    {'product_id': 'qr-cube', 'title': '高級感のある佇まい', 'description': '10mm以上の厚みが生み出す重厚感。店舗の雰囲気を損なわず、むしろ格上げします。', 'sort_order': 1},
    {'product_id': 'qr-cube', 'title': 'スキャンしやすい設計', 'description': '適度な角度で自立し、お客様がスマホをかざしやすい高さを実現。', 'sort_order': 2},
    {'product_id': 'qr-cube', 'title': '長期間使える耐久性', 'description': 'UV印刷は色褪せに強く、アクリル素材は割れにくい。長くお使いいただけます。', 'sort_order': 3},
    {'product_id': 'qr-cube', 'title': 'お手入れ簡単', 'description': '柔らかい布で拭くだけ。水洗いも可能で、清潔に保てます。', 'sort_order': 4},
    # Wall Sign
    {'product_id': 'wall-sign', 'title': '浮遊感のあるデザイン', 'description': '壁から浮かせることで影が生まれ、立体感と奥行きを演出。来訪者に印象的な第一印象を。', 'sort_order': 1},
    {'product_id': 'wall-sign', 'title': '壁素材を活かす透明感', 'description': 'コンクリート、木、タイルなど、壁の素材感を活かしながらブランドを主張できます。', 'sort_order': 2},
    {'product_id': 'wall-sign', 'title': '選べる仕上げ', 'description': 'UV印刷、レーザー彫刻、カッティングから、ブランドイメージに合った加工方法をお選びいただけます。', 'sort_order': 3},
    {'product_id': 'wall-sign', 'title': '設置も安心', 'description': '化粧ビス一式と詳細な取付説明書が付属。施工業者様への指示もスムーズです。', 'sort_order': 4},
    # Card Display
    {'product_id': 'card-display', 'title': 'UVカット99%', 'description': '紫外線を99%カットし、大切なカードを日焼けから守ります。窓際に飾っても安心。', 'sort_order': 1},
    {'product_id': 'card-display', 'title': '3層構造で完全保護', 'description': 'カードを3枚のアクリルで挟み込み、ホコリや傷から完全に保護します。', 'sort_order': 2},
    {'product_id': 'card-display', 'title': '美しい装飾彫刻', 'description': 'カード枠にレーザー彫刻で繊細な装飾を施し、高級感を演出します。', 'sort_order': 3},
    {'product_id': 'card-display', 'title': 'スタンド付属', 'description': '縦置き・横置き両対応のスタンドが付属。デスクや棚に美しくディスプレイできます。', 'sort_order': 4},
]

# =============================================================================
# 商品FAQデータ
# =============================================================================

PRODUCT_FAQS = [
    # QR Cube
    {'product_id': 'qr-cube', 'question': 'QRコードのデータはどのように入稿すればよいですか？', 'answer': 'QRコードの画像データ（PNG/JPG）をお送りいただくか、リンク先URLをお知らせください。当方でQRコードを生成することも可能です。', 'sort_order': 1},
    {'product_id': 'qr-cube', 'question': '複数のQRコードを1つのキューブに入れられますか？', 'answer': '1面につき1つのQRコードとなります。複数面への印刷は別途ご相談ください。', 'sort_order': 2},
    {'product_id': 'qr-cube', 'question': '屋外でも使用できますか？', 'answer': '基本的に屋内使用を想定しています。直射日光や雨風にさらされる環境では、劣化が早まる可能性があります。', 'sort_order': 3},
    {'product_id': 'qr-cube', 'question': '追加注文は可能ですか？', 'answer': 'はい、同じデザインでの追加注文を承っております。データは1年間保管しておりますので、お気軽にご連絡ください。', 'sort_order': 4},
    # Wall Sign
    {'product_id': 'wall-sign', 'question': '取り付け工事は依頼できますか？', 'answer': '申し訳ございませんが、取り付け工事は承っておりません。お近くの施工業者様へご依頼ください。詳細な取付説明書をお付けしておりますので、スムーズに設置いただけます。', 'sort_order': 1},
    {'product_id': 'wall-sign', 'question': 'ロゴデータはどのような形式で入稿すればよいですか？', 'answer': 'AI（Illustrator）、EPS、PDF、SVGなどのベクターデータが最適です。JPG/PNGの場合は、解像度300dpi以上の高解像度データをご用意ください。', 'sort_order': 2},
    {'product_id': 'wall-sign', 'question': '屋外に設置できますか？', 'answer': '屋外対応オプション（+¥10,000〜）をご用意しております。UV耐性加工と防水処理を施します。ただし、直射日光が当たる場所での長期使用は推奨しておりません。', 'sort_order': 3},
    {'product_id': 'wall-sign', 'question': '複数枚の注文で割引はありますか？', 'answer': 'はい、3枚以上のご注文で10%OFF、10枚以上で15%OFFとなります。複数拠点への設置などでご活用ください。', 'sort_order': 4},
    # Card Display
    {'product_id': 'card-display', 'question': 'スリーブに入れたままでも入りますか？', 'answer': 'インナースリーブ装着状態での収納を想定しています。厚手のスリーブやマグネットホルダーに入れた状態では入りませんのでご注意ください。', 'sort_order': 1},
    {'product_id': 'card-display', 'question': 'PSA鑑定済みカードは入りますか？', 'answer': 'PSAケースサイズ対応のディスプレイも別途ご用意しております。お問い合わせください。', 'sort_order': 2},
    {'product_id': 'card-display', 'question': '複数枚セットでの割引はありますか？', 'answer': '3個以上のご注文で10%OFF、5個以上で15%OFF、10個以上で20%OFFとなります。コレクション展示にご活用ください。', 'sort_order': 3},
    {'product_id': 'card-display', 'question': 'カードの出し入れは簡単ですか？', 'answer': '3層構造の中間層を取り外してカードを交換できます。頻繁な入れ替えにも対応しています。', 'sort_order': 4},
]

# =============================================================================
# 関連商品データ
# =============================================================================

PRODUCT_RELATIONS = [
    # QR Cube
    {'product_id': 'qr-cube', 'related_product_id': 'logo-cutout', 'sort_order': 1},
    {'product_id': 'qr-cube', 'related_product_id': 'price-tag', 'sort_order': 2},
    {'product_id': 'qr-cube', 'related_product_id': 'menu-stand', 'sort_order': 3},
    # Wall Sign
    {'product_id': 'wall-sign', 'related_product_id': 'tombstones', 'sort_order': 1},
    {'product_id': 'wall-sign', 'related_product_id': 'door-sign', 'sort_order': 2},
    {'product_id': 'wall-sign', 'related_product_id': 'reception', 'sort_order': 3},
    # Card Display
    {'product_id': 'card-display', 'related_product_id': 'acrylic-stand', 'sort_order': 1},
    {'product_id': 'card-display', 'related_product_id': 'photo-frame', 'sort_order': 2},
    {'product_id': 'card-display', 'related_product_id': 'key-block', 'sort_order': 3},
]
