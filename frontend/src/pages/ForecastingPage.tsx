import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DateRangePicker from '../components/DateRangePicker';
import { Card, SkeletonCard, SkeletonTable } from '../components/ui';
import { api } from '../utils/api';
import type { ForecastData } from '../types';

const ForecastingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);
  const [mode, setMode] = useState<'quantity' | 'value'>('quantity');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchForecast = useCallback((periodDays = 30, forecastMode?: string) => {
    setLoading(true);
    const m = forecastMode || mode;
    let url = `/forecasting?lang=${i18n.language}&mode=${m}&period_days=${periodDays}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    api.get<ForecastData>(url)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [i18n.language, mode, startDate, endDate]);

  useEffect(() => { fetchForecast(days, mode); }, [days, mode, i18n.language, startDate, endDate, fetchForecast]);

  if (loading) return <div className="page"><h2>{t('forecasting.title')}</h2><div className="card-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div><SkeletonTable rows={8} cols={5} /></div>;
  if (error) return <div className="page"><h2>{t('forecasting.title')}</h2><p className="error">{error}</p></div>;
  if (!data) return null;

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
  const dayOpts = [7, 30, 60, 90];

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2>{t('forecasting.demandForecast')}</h2>
        <div className="toggle-group">
          <button className={`toggle-btn ${mode === 'quantity' ? 'active' : ''}`} onClick={() => setMode('quantity')}>{i18n.language === 'ar' ? 'كمية' : 'Quantity'}</button>
          <button className={`toggle-btn ${mode === 'value' ? 'active' : ''}`} onClick={() => setMode('value')}>{i18n.language === 'ar' ? 'قيمة' : 'Value'}</button>
        </div>
      </div>
      <p className="meta">{t('common.agent')}: {data.agent} | {data.execution_time_ms}ms</p>
      <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />

      <div className="controls-row">
        <label>{t('forecasting.forecastPeriod')}: <select value={days} onChange={e => { setDays(+e.target.value); fetchForecast(+e.target.value, mode); }}>
          {dayOpts.map(d => (
            <option key={d} value={d}>{t(`forecasting.days_${d}`)}</option>
          ))}
        </select></label>
      </div>

      <div className="card-grid">
        <Card title={t('forecasting.period')} value={`${data.period?.start_date || ''} → ${data.period?.end_date || ''}`} />
        <Card title={t('forecasting.forecastQty')} value={(data.period?.total_forecast_qty || 0).toLocaleString(locale)} />
        <Card title={t('forecasting.forecastValue')} value={(data.period?.total_forecast_value || 0).toLocaleString(locale)} />
      </div>

      {data.items && data.items.length > 0 && (
        <div className="chart-section">
          <h3>{t('forecasting.chartTitle')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.items.slice(0, 10).map(i => ({
              name: i.product_name || i.product_code,
              forecast: i.forecast_qty,
              avgSales: i.historical_avg_sales,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgSales" fill="var(--accent)" name={i18n.language === 'ar' ? 'متوسط المبيعات/اليوم' : 'Avg Sales/Day'} radius={[4, 4, 0, 0]} />
              <Bar dataKey="forecast" fill="#e74c3c" name={i18n.language === 'ar' ? 'التوقع' : 'Forecast'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3>{t('forecasting.productForecasts')} ({data.items?.length || 0})</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t('forecasting.table.product')}</th><th>{t('forecasting.table.name')}</th><th>{t('forecasting.table.avgSales')}</th><th>{t('forecasting.table.forecast')}</th><th>{t('forecasting.table.confidence')}</th></tr></thead>
          <tbody>
            {data.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.product_code}</td><td>{item.product_name}</td>
                <td>{item.historical_avg_sales.toLocaleString(locale)}</td>
                <td>{item.forecast_qty.toLocaleString(locale)}</td>
                <td>{Math.round(item.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastingPage;
