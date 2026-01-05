import { NextRequest, NextResponse } from 'next/server';

// バックエンドAPIのベースURL（Middlewareはサーバーサイドで実行されるため、Docker内部のURLを使用）
const API_BASE_URL =
  process.env.SERVER_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

// 認証機能の有効/無効
const ENABLE_AUTH = process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'false';

// ユーザー認証が必要なパス（ECサイト: マイページ、チェックアウト）
const USER_PROTECTED_PATHS = ['/mypage', '/checkout'];

// ユーザー認証済みがアクセスできないパス（ログイン・登録ページ）
const USER_AUTH_PATHS = ['/login', '/register'];

// 管理者認証が必要なパス
const ADMIN_PROTECTED_PATHS = ['/admin'];

// 管理者ログインページ
const ADMIN_LOGIN_PATH = '/admin/login';

/**
 * Middleware: サーバーサイドで認証状態をチェック
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が無効の場合はすべてのパスを許可
  if (!ENABLE_AUTH) {
    return NextResponse.next();
  }

  // === 管理者認証 ===
  const isAdminPath = ADMIN_PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );
  const isAdminLoginPath = pathname === ADMIN_LOGIN_PATH;

  if (isAdminPath) {
    const adminAccessToken = request.cookies.get('admin_access_token')?.value;

    // 管理者ログインページの場合
    if (isAdminLoginPath) {
      if (adminAccessToken) {
        const isAuthenticated = await verifyAdminToken(adminAccessToken);
        if (isAuthenticated) {
          // 認証済みの場合: ダッシュボードへリダイレクト
          const url = request.nextUrl.clone();
          url.pathname = '/admin';
          return NextResponse.redirect(url);
        }
      }
      // 未認証の場合: ログインページを表示
      return NextResponse.next();
    }

    // 管理者保護ページの場合
    if (!adminAccessToken) {
      // トークンがない場合はログインページへリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN_PATH;
      return NextResponse.redirect(url);
    }

    // トークンがある場合、バックエンドで検証
    const isAuthenticated = await verifyAdminToken(adminAccessToken);
    if (!isAuthenticated) {
      // 認証失敗: ログインページへリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN_PATH;
      return NextResponse.redirect(url);
    }

    // 認証成功: そのまま続行
    return NextResponse.next();
  }

  // === ユーザー認証 ===
  const isUserProtectedPath = USER_PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );
  const isUserAuthPath = USER_AUTH_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  // Cookieからaccess_tokenを取得
  const accessToken = request.cookies.get('access_token')?.value;

  // 保護されたパスにアクセスしようとしている場合
  if (isUserProtectedPath) {
    if (!accessToken) {
      // トークンがない場合はログインページへリダイレクト（リダイレクト先を保存）
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // トークンがある場合、バックエンドで検証
    const isAuthenticated = await verifyUserToken(accessToken);
    if (!isAuthenticated) {
      // 認証失敗: ログインページへリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // 認証成功: そのまま続行
    return NextResponse.next();
  }

  // ログイン/登録ページにアクセスしようとしている場合
  if (isUserAuthPath && accessToken) {
    // トークンがある場合、バックエンドで検証
    const isAuthenticated = await verifyUserToken(accessToken);
    if (isAuthenticated) {
      // 認証済みの場合: リダイレクト先があればそこへ、なければマイページへ
      const redirect = request.nextUrl.searchParams.get('redirect');
      const url = request.nextUrl.clone();
      url.pathname = redirect || '/mypage';
      url.searchParams.delete('redirect');
      return NextResponse.redirect(url);
    }
  }

  // その他のパスはそのまま続行（トップページ、商品ページなど公開ページ）
  return NextResponse.next();
}

/**
 * バックエンドAPIでユーザートークンを検証
 */
async function verifyUserToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
      method: 'GET',
      headers: {
        Cookie: `access_token=${token}`,
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch (error) {
    console.error('User token verification error:', error);
    return false;
  }
}

/**
 * バックエンドAPIで管理者トークンを検証
 */
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/status`, {
      method: 'GET',
      headers: {
        Cookie: `admin_access_token=${token}`,
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch (error) {
    console.error('Admin token verification error:', error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - SVG, images (static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|SVG|images).*)',
  ],
};
