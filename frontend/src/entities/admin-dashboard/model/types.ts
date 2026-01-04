// === ダッシュボードサマリー ===
export interface DashboardSummary {
  today_orders: number;
  today_revenue: number;
  pending_orders: number;
  processing_orders: number;
  new_customers_this_month: number;
}

// === ダッシュボード取得レスポンス ===
export interface GetDashboardResponse {
  summary: DashboardSummary;
}

// === 統計期間 ===
export type StatsPeriod = 'daily' | 'weekly' | 'monthly';

// === 統計データポイント ===
export interface StatsDataPoint {
  date: string;
  orders: number;
  revenue: number;
}

// === 統計サマリー ===
export interface StatsSummary {
  total_orders: number;
  total_revenue: number;
}

// === 統計取得リクエスト ===
export interface GetStatsRequest {
  period: StatsPeriod;
  date_from: string;
  date_to: string;
}

// === 統計取得レスポンス ===
export interface GetStatsResponse {
  data: StatsDataPoint[];
  summary: StatsSummary;
}
