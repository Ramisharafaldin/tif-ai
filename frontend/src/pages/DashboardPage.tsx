import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DateRangePicker from '../components/DateRangePicker';
import { Card, SkeletonCard } from '../components/ui';
import { api } from '../utils/api';
import type { DashboardData } from '../types';

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(() => {
    setLoading(true);
    const lang = i18n.language;
    let url = `/dashboard?lang=${lang}&narrative=true`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    api.get<DashboardData>(url)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [i18n.language, startDate, endDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="page"><h2>{t('dashboard.title')}</h2><div className="card-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></div>;
  if (error) return <div className="page"><h2>{t('dashboard.title')}</h2><p className="error">{error}</p></div>;
  if (!data) return null;

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
  const fmt = (v: number, f: string) =>
    f === 'percent' ? `${v}%` : v.toLocaleString(locale);

  const trendVariant = (trend: string) =>
    trend === 'up' ? 'out' as const : trend === 'down' ? 'low' as const : 'over' as const;

  return (
    <div className="page">
      <h2>{t('dashboard.overview')}</h2>
      <p className="meta">{t('common.agent')}: {data.agent} | {data.execution_time_ms}ms</p>
      <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />

      <div className="card-grid">
        {data.kpis.map((k, i) => (
          <Card key={i} variant={trendVariant(k.trend)} title={k.name.replace(/_/g, ' ')} value={fmt(k.value, k.format)} trend={k.trend}>
            {k.explanation}
          </Card>
        ))}
      </div>

      {data.ai_narrative && (
        <div className="insight" style={{ background: 'var(--accent)', color: 'white', padding: '1rem 1.25rem', borderRadius: '8px', marginTop: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: 'white' }}>{i18n.language === 'ar' ? 'تحليل AI' : 'AI Analysis'}</h4>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{data.ai_narrative}</p>
        </div>
      )}

      {data.kpis.length > 1 && (
        <div className="chart-section">
          <h3>{t('dashboard.kpiComparison')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.kpis.map(k => ({ name: k.name.replace(/_/g, ' '), value: k.value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.alerts && data.alerts.length > 0 && (
        <>
          <h3>{t('dashboard.alerts')} ({data.alerts.length})</h3>
          <div className="alert-list">
            {data.alerts.map((a, i) => (
              <div key={i} className={`alert alert-${a.severity}`}>
                <strong>{a.type}</strong> — {a.message}
                <p className="action">{a.recommended_action}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {data.insights && data.insights.length > 0 && (
        <>
          <h3>{t('dashboard.insights')}</h3>
          <div className="insight-list">
            {data.insights.map((ins, i) => (
              <div key={i} className="insight">
                <h4>{ins.title}</h4>
                <p>{ins.description}</p>
                <p className="action">{ins.recommended_action}</p>
                <small>{t('dashboard.confidence')}: {Math.round(ins.confidence * 100)}%</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
