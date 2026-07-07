import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, SkeletonCard, SkeletonTable, Input, Button } from '../components/ui';
import { api } from '../utils/api';
import type { SafetyStockData } from '../types';

const SafetyStockPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<SafetyStockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceLevel, setServiceLevel] = useState(1.645);
  const [leadTime, setLeadTime] = useState(7);

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get<SafetyStockData>(`/analytics/safety-stock?service_level=${serviceLevel}&lead_time_days=${leadTime}`)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [serviceLevel, leadTime]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="page"><h2>{i18n.language === 'ar' ? 'مخزون الأمان' : 'Safety Stock'}</h2><div className="card-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div><SkeletonTable rows={8} cols={7} /></div>;
  if (error) return <div className="page"><h2>{i18n.language === 'ar' ? 'مخزون الأمان' : 'Safety Stock'}</h2><p className="error">{error}</p></div>;
  if (!data) return null;

  return (
    <div className="page">
      <h2>{i18n.language === 'ar' ? 'تحليل مخزون الأمان' : 'Safety Stock Analysis'}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <Input label={i18n.language === 'ar' ? 'معامل مستوى الخدمة (Z)' : 'Service Level (Z)'} type="number" step="0.001" min={0} max={3} value={serviceLevel} onChange={e => setServiceLevel(+e.target.value)} />
        <Input label={i18n.language === 'ar' ? 'مهلة التوريد (أيام)' : 'Lead Time (Days)'} type="number" min={1} max={365} value={leadTime} onChange={e => setLeadTime(+e.target.value)} />
        <Button onClick={fetchData}>{i18n.language === 'ar' ? 'حساب' : 'Calculate'}</Button>
      </div>

      {data.summary && (
        <div className="card-grid">
          <Card title={i18n.language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'} value={data.summary.total_products} />
          <Card title={i18n.language === 'ar' ? 'إجمالي مخزون الأمان' : 'Total Safety Stock'} value={data.summary.total_safety_stock.toLocaleString(locale)} />
          <Card title={i18n.language === 'ar' ? 'مستوى الخدمة' : 'Service Level'} value={`${data.summary.service_level_pct}%`} />
          <Card title={i18n.language === 'ar' ? 'مهلة التوريد' : 'Lead Time'} value={`${data.summary.lead_time_days} ${i18n.language === 'ar' ? 'يوم' : 'days'}`} />
        </div>
      )}

      <h3>{i18n.language === 'ar' ? 'نتائج مخزون الأمان' : 'Safety Stock Results'} ({data.items.length})</h3>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>{i18n.language === 'ar' ? 'المنتج' : 'Product'}</th>
            <th>{i18n.language === 'ar' ? 'متوسط المبيعات/اليوم' : 'Avg Sales/Day'}</th>
            <th>{i18n.language === 'ar' ? 'الانحراف المعياري' : 'Std Dev'}</th>
            <th>{i18n.language === 'ar' ? 'مخزون الأمان' : 'Safety Stock'}</th>
            <th>{i18n.language === 'ar' ? 'نقطة إعادة الطلب' : 'Reorder Point'}</th>
            <th>{i18n.language === 'ar' ? 'المخزون الحالي' : 'Current Stock'}</th>
            <th>{i18n.language === 'ar' ? 'العجز' : 'Deficit'}</th>
          </tr></thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i}>
                <td>{item.product_name || item.product_code}</td>
                <td>{item.avg_daily_sales.toFixed(2)}</td>
                <td>{item.sales_std.toFixed(2)}</td>
                <td><strong>{item.safety_stock}</strong></td>
                <td>{item.reorder_point}</td>
                <td>{item.current_stock}</td>
                <td style={{ color: item.stock_deficit > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: item.stock_deficit > 0 ? 600 : 400 }}>
                  {item.stock_deficit > 0 ? item.stock_deficit : '✓'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SafetyStockPage;
