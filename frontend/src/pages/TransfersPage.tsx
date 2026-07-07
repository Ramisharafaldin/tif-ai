import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DateRangePicker from '../components/DateRangePicker';
import { Skeleton, SkeletonTable, Badge } from '../components/ui';
import { api } from '../utils/api';
import type { TransferData } from '../types';

const TransfersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<TransferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'value' | 'quantity'>('value');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(() => {
    setLoading(true);
    let url = `/transfers?lang=${i18n.language}&mode=${mode}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    api.get<TransferData>(url)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [i18n.language, mode, startDate, endDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="page"><h2>{t('transfers.title')}</h2><Skeleton variant="rect" height="60px" /><SkeletonTable rows={5} cols={6} /></div>;
  if (error) return <div className="page"><h2>{t('transfers.title')}</h2><p className="error">{error}</p></div>;
  if (!data) return null;

  const badgeVariant = (p: string) =>
    p === 'high' ? 'danger' as const : p === 'medium' ? 'warning' as const : 'success' as const;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2>{t('transfers.logistics')}</h2>
        <div className="toggle-group">
          <button className={`toggle-btn ${mode === 'value' ? 'active' : ''}`} onClick={() => setMode('value')}>{i18n.language === 'ar' ? 'قيمة' : 'Value'}</button>
          <button className={`toggle-btn ${mode === 'quantity' ? 'active' : ''}`} onClick={() => setMode('quantity')}>{i18n.language === 'ar' ? 'كمية' : 'Quantity'}</button>
        </div>
      </div>
      <p className="meta">{t('common.agent')}: {data.agent} | {data.execution_time_ms}ms</p>
      <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />

      {data.alerts && data.alerts.length > 0 && (
        <div className="alert-list">
          {data.alerts.map((a, i) => (
            <div key={i} className={`alert alert-${a.severity}`}>
              <strong>{a.type}</strong> — {a.message}
              <p className="action">{a.recommended_action}</p>
            </div>
          ))}
        </div>
      )}

      {!data.recommendations || data.recommendations.length === 0 ? (
        <p>{t('transfers.noRecommendations')}</p>
      ) : (
        <>
          <h3>{t('transfers.recommendations')} ({data.recommendations.length})</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('transfers.table.product')}</th><th>{t('transfers.table.from')}</th><th>{t('transfers.table.to')}</th><th>{t('transfers.table.qty')}</th><th>{t('transfers.table.priority')}</th><th>{t('transfers.table.reason')}</th></tr></thead>
              <tbody>
                {data.recommendations.map((r, i) => (
                  <tr key={i}>
                    <td>{r.product_name || r.product_code}</td>
                    <td>{r.from_branch}</td><td>{r.to_branch}</td>
                    <td>{r.quantity}</td>
                    <td><Badge variant={badgeVariant(r.priority)}>{r.priority}</Badge></td>
                    <td className="reason">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TransfersPage;
