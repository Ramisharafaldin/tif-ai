export function fmtPercent(v: number): string {
  return `${Math.round(v * 100)}%`;
}

export function fmtCurrency(v: number, locale = 'en-US'): string {
  return v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtNumber(v: number, locale = 'en-US'): string {
  return v.toLocaleString(locale);
}

export function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function statusLabel(status: string, ar: boolean): string {
  const labels: Record<string, [string, string]> = {
    out_of_stock: ['Out of Stock', 'نفد المخزون'],
    low: ['Low Stock', 'مخزون منخفض'],
    overstocked: ['Overstocked', 'مخزون زائد'],
    normal: ['Normal', 'طبيعي'],
  };
  return (labels[status] || [status, status])[ar ? 1 : 0];
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'high': return '#e74c3c';
    case 'medium': return '#f39c12';
    case 'low': return '#2ecc71';
    default: return '#3498db';
  }
}
