export interface KPI {
  name: string;
  value: number;
  format: string;
  trend: string;
  explanation: string;
}

export interface Alert {
  type: string;
  severity: string;
  entity: string;
  message: string;
  recommended_action: string;
}

export interface Insight {
  title: string;
  description: string;
  confidence: number;
  recommended_action: string;
}

export interface DashboardData {
  kpis: KPI[];
  alerts: Alert[];
  insights: Insight[];
  generated_at: string;
  agent: string;
  execution_time_ms: number;
  ai_narrative?: string;
}

export interface InvSummary {
  total_products: number;
  total_stock_value: number;
  total_items: number;
  overstocked_count: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

export interface InvItem {
  product_code: string;
  product_name: string;
  category: string;
  branch_code: string;
  closing_stock: number;
  stock_value: number;
  status: string;
  avg_daily_sales?: number;
  months_of_stock?: number;
  target_stock?: number;
  required_purchase_qty?: number;
  recommendation?: string;
}

export interface InvAlert {
  type: string;
  severity: string;
  message: string;
  recommended_action: string;
}

export interface InvData {
  summary: InvSummary;
  items: InvItem[];
  alerts: InvAlert[];
  target_days?: number;
}

export interface Product {
  product_code: string;
  product_name: string;
  category: string;
  unit_cost: number;
  unit_price: number;
}

export interface ForecastItem {
  product_code: string;
  product_name: string;
  branch_code: string;
  historical_avg_sales: number;
  forecast_qty: number;
  forecast_value?: number;
  confidence: number;
  trend: string;
}

export interface ForecastPeriod {
  start_date: string;
  end_date: string;
  total_forecast_qty: number;
  total_forecast_value: number;
}

export interface ForecastData {
  period: ForecastPeriod;
  items: ForecastItem[];
  agent: string;
  execution_time_ms: number;
  mode?: string;
}

export interface TransferRecommendation {
  product_code: string;
  product_name: string;
  from_branch: string;
  to_branch: string;
  quantity: number;
  reason: string;
  priority: string;
}

export interface TransferAlert {
  type: string;
  severity: string;
  message: string;
  recommended_action: string;
}

export interface TransferData {
  recommendations: TransferRecommendation[];
  alerts: TransferAlert[];
  agent: string;
  execution_time_ms: number;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminStats {
  users_count: number;
  products_count: number;
  inventory_rows: number;
  sales_rows: number;
  audit_log_count: number;
}

export interface SafetyStockItem {
  product_code: string;
  product_name: string;
  avg_daily_sales: number;
  sales_std: number;
  service_level_z: number;
  lead_time_days: number;
  safety_stock: number;
  reorder_point: number;
  current_stock: number;
  stock_deficit: number;
}

export interface SafetyStockSummary {
  total_products: number;
  total_safety_stock: number;
  service_level_pct: number;
  lead_time_days: number;
}

export interface SafetyStockData {
  items: SafetyStockItem[];
  summary: SafetyStockSummary;
}

export interface ABCItem {
  product_code: string;
  product_name: string;
  stock_value: number;
  closing_stock: number;
  category: string;
  cumulative_pct: number;
  abc_class: string;
}

export interface ABCCategory {
  items: ABCItem[];
  count: number;
  value: number;
  pct: number;
}

export interface ABCData {
  categories: { A: ABCCategory; B: ABCCategory; C: ABCCategory };
  summary: { total_value: number; a_value: number; b_value: number; c_value: number };
}

export interface XYZItem {
  product_code: string;
  product_name: string;
  avg_daily_sales: number;
  std_daily_sales: number;
  cv: number;
  xyz_class: string;
}

export interface XYZCategory {
  items: XYZItem[];
  count: number;
}

export interface XYZData {
  categories: { X: XYZCategory; Y: XYZCategory; Z: XYZCategory };
  summary: { total_products: number };
}

export interface FSNItem {
  product_code: string;
  product_name: string;
  total_sales: number;
  active_days: number;
  daily_sales_rate: number;
  fsn_class: string;
}

export interface FSNCategory {
  items: FSNItem[];
  count: number;
}

export interface FSNData {
  categories: { F: FSNCategory; S: FSNCategory; N: FSNCategory };
  summary: { total_products: number };
}

export interface EoqItem {
  product_code: string;
  product_name: string;
  unit_cost: number;
  annual_demand: number;
  order_cost: number;
  holding_cost_per_unit: number;
  holding_cost_pct: number;
  eoq: number;
  current_stock: number;
  orders_per_year: number;
}

export interface EoqSummary {
  total_products: number;
  default_order_cost: number;
  default_holding_cost_pct: number;
}

export interface EoqData {
  items: EoqItem[];
  summary: EoqSummary;
}
