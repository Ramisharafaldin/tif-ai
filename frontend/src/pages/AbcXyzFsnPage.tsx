import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, SkeletonCard, SkeletonTable, Badge } from '../components/ui';
import { api } from '../utils/api';
import type { ABCData, XYZData, FSNData } from '../types';

type Tab = 'abc' | 'xyz' | 'fsn';

const AbcXyzFsnPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [tab, setTab] = useState<Tab>('abc');
  const [abcData, setAbcData] = useState<ABCData | null>(null);
  const [xyzData, setXyzData] = useState<XYZData | null>(null);
  const [fsnData, setFsnData] = useState<FSNData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<ABCData>('/analytics/abc'),
      api.get<XYZData>('/analytics/xyz'),
      api.get<FSNData>('/analytics/fsn'),
    ]).then(([abc, xyz, fsn]) => {
      setAbcData(abc);
      setXyzData(xyz);
      setFsnData(fsn);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'abc', label: i18n.language === 'ar' ? 'تحليل ABC' : 'ABC Analysis' },
    { key: 'xyz', label: i18n.language === 'ar' ? 'تحليل XYZ' : 'XYZ Analysis' },
    { key: 'fsn', label: i18n.language === 'ar' ? 'تحليل FSN' : 'FSN Analysis' },
  ];

  if (loading) return <div className="page"><h2>{i18n.language === 'ar' ? 'تحليلات المخزون' : 'Inventory Analytics'}</h2><div className="card-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div><SkeletonTable rows={10} cols={6} /></div>;
  if (error) return <div className="page"><h2>{i18n.language === 'ar' ? 'تحليلات المخزون' : 'Inventory Analytics'}</h2><p className="error">{error}</p></div>;

  const abcBadge = (cls: string) => {
    const v = cls === 'A' ? 'danger' as const : cls === 'B' ? 'warning' as const : 'info' as const;
    return <Badge variant={v}>{cls}</Badge>;
  };

  const xyzBadge = (cls: string) => {
    const v = cls === 'X' ? 'success' as const : cls === 'Y' ? 'warning' as const : 'danger' as const;
    return <Badge variant={v}>{cls}</Badge>;
  };

  const fsnBadge = (cls: string) => {
    const v = cls === 'F' ? 'danger' as const : cls === 'S' ? 'warning' as const : 'info' as const;
    return <Badge variant={v}>{i18n.language === 'ar' ? (cls === 'F' ? 'سريع' : cls === 'S' ? 'بطيء' : 'راكد') : cls}</Badge>;
  };

  return (
    <div className="page">
      <h2>{i18n.language === 'ar' ? 'تحليلات المخزون المتقدمة' : 'Advanced Inventory Analytics'}</h2>

      <div className="tabs" style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === 'abc' && abcData && (
        <>
          {abcData.summary && (
            <div className="card-grid">
              <Card title={i18n.language === 'ar' ? 'إجمالي القيمة' : 'Total Value'} value={abcData.summary.total_value.toLocaleString(locale)} />
              <Card accent="#e74c3c" title="A" value={`${abcData.categories.A.pct}% — ${abcData.categories.A.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {abcData.summary.a_value.toLocaleString(locale)}
              </Card>
              <Card accent="#f39c12" title="B" value={`${abcData.categories.B.pct}% — ${abcData.categories.B.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {abcData.summary.b_value.toLocaleString(locale)}
              </Card>
              <Card accent="#3498db" title="C" value={`${abcData.categories.C.pct}% — ${abcData.categories.C.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {abcData.summary.c_value.toLocaleString(locale)}
              </Card>
            </div>
          )}

          {(['A', 'B', 'C'] as const).map(cls => (
            <div key={cls} style={{ marginBottom: '1.5rem' }}>
              <h3>{i18n.language === 'ar' ? `الفئة ${cls}` : `Category ${cls}`} ({abcData.categories[cls].items.length})</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>{i18n.language === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th>{i18n.language === 'ar' ? 'التصنيف' : 'Type'}</th>
                    <th>{i18n.language === 'ar' ? 'قيمة المخزون' : 'Stock Value'}</th>
                    <th>{i18n.language === 'ar' ? 'المخزون' : 'Stock'}</th>
                    <th>{i18n.language === 'ar' ? 'النسبة التراكمية' : 'Cumulative %'}</th>
                    <th>{i18n.language === 'ar' ? 'الفئة' : 'Class'}</th>
                  </tr></thead>
                  <tbody>
                    {abcData.categories[cls].items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.product_name || item.product_code}</td>
                        <td>{item.category}</td>
                        <td>{item.stock_value.toLocaleString(locale)}</td>
                        <td>{item.closing_stock}</td>
                        <td>{item.cumulative_pct}%</td>
                        <td>{abcBadge(item.abc_class)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'xyz' && xyzData && (
        <>
          {xyzData.summary && (
            <div className="card-grid">
              <Card title={i18n.language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'} value={xyzData.summary.total_products} />
              <Card accent="#27ae60" title="X" value={`${xyzData.categories.X.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {i18n.language === 'ar' ? 'مستقر (CV < 0.5)' : 'Stable (CV < 0.5)'}
              </Card>
              <Card accent="#f39c12" title="Y" value={`${xyzData.categories.Y.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {i18n.language === 'ar' ? 'متغير (0.5 ≤ CV < 1.0)' : 'Variable (0.5 ≤ CV < 1.0)'}
              </Card>
              <Card accent="#e74c3c" title="Z" value={`${xyzData.categories.Z.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {i18n.language === 'ar' ? 'غير منتظم (CV ≥ 1.0)' : 'Erratic (CV ≥ 1.0)'}
              </Card>
            </div>
          )}

          {(['X', 'Y', 'Z'] as const).map(cls => (
            <div key={cls} style={{ marginBottom: '1.5rem' }}>
              <h3>{i18n.language === 'ar' ? `الفئة ${cls}` : `Category ${cls}`} ({xyzData.categories[cls].items.length})</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>{i18n.language === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th>{i18n.language === 'ar' ? 'متوسط المبيعات/اليوم' : 'Avg Sales/Day'}</th>
                    <th>{i18n.language === 'ar' ? 'الانحراف المعياري' : 'Std Dev'}</th>
                    <th>CV</th>
                    <th>{i18n.language === 'ar' ? 'الفئة' : 'Class'}</th>
                  </tr></thead>
                  <tbody>
                    {xyzData.categories[cls].items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.product_name || item.product_code}</td>
                        <td>{item.avg_daily_sales}</td>
                        <td>{item.std_daily_sales}</td>
                        <td>{item.cv}</td>
                        <td>{xyzBadge(item.xyz_class)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'fsn' && fsnData && (
        <>
          {fsnData.summary && (
            <div className="card-grid">
              <Card title={i18n.language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'} value={fsnData.summary.total_products} />
              <Card accent="#e74c3c" title="F" value={`${fsnData.categories.F.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {i18n.language === 'ar' ? 'سريع الحركة (≥ 5/يوم)' : 'Fast-moving (≥ 5/day)'}
              </Card>
              <Card accent="#f39c12" title="S" value={`${fsnData.categories.S.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {i18n.language === 'ar' ? 'بطيء الحركة (1-5/يوم)' : 'Slow-moving (1-5/day)'}
              </Card>
              <Card accent="#3498db" title="N" value={`${fsnData.categories.N.count} ${i18n.language === 'ar' ? 'منتج' : 'products'}`}>
                {i18n.language === 'ar' ? 'غير متحرك (< 1/يوم)' : 'Non-moving (< 1/day)'}
              </Card>
            </div>
          )}

          {(['F', 'S', 'N'] as const).map(cls => (
            <div key={cls} style={{ marginBottom: '1.5rem' }}>
              <h3>{fsnBadge(cls)} ({fsnData.categories[cls].items.length})</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>{i18n.language === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th>{i18n.language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}</th>
                    <th>{i18n.language === 'ar' ? 'أيام النشاط' : 'Active Days'}</th>
                    <th>{i18n.language === 'ar' ? 'معدل البيع/اليوم' : 'Sales/Day'}</th>
                    <th>{i18n.language === 'ar' ? 'الفئة' : 'Class'}</th>
                  </tr></thead>
                  <tbody>
                    {fsnData.categories[cls].items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.product_name || item.product_code}</td>
                        <td>{item.total_sales.toLocaleString(locale)}</td>
                        <td>{item.active_days}</td>
                        <td>{item.daily_sales_rate}</td>
                        <td>{fsnBadge(item.fsn_class)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AbcXyzFsnPage;
