// === ログアクション ===
export type LogAction = 'login' | 'logout' | 'create' | 'update' | 'delete';

// === ログ対象タイプ ===
export type LogTargetType = 'admin' | 'user' | 'product' | 'order';

// === 操作ログ ===
export interface AdminLog {
  id: number;
  admin_id: number;
  admin_name: string | null;
  action: LogAction;
  target_type: LogTargetType;
  target_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// === 操作ログ一覧取得リクエスト ===
export interface GetAdminLogsRequest {
  admin_id?: number;
  action?: LogAction;
  target_type?: LogTargetType;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

// === 操作ログ一覧取得レスポンス ===
export interface GetAdminLogsResponse {
  logs: AdminLog[];
  total: number;
  limit: number;
  offset: number;
}
