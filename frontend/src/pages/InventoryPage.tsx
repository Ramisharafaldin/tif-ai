import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DateRangePicker from '../components/DateRangePicker';
import { Card, SkeletonCard, SkeletonTable, Modal, Input, Button, Badge } from '../components/ui';
import { api } from '../utils/api';
import type { InvData, Product } from '../types';

const emptyForm = { product_code: '', product_name: '', category: '', unit_cost: 0, unit_price: 0 };

const InventoryPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<InvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState<'value' | 'quantity'>('value');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetDays, setTargetDays] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

  const fetchData = useCallback(() => {
    setLoading(true);
    const lang = i18n.language;
    let invUrl = `/inventory?lang=${lang}&mode=${mode}&target_days=${targetDays}`;
    if (startDate) invUrl += `&start_date=${startDate}`;
    if (endDate) invUrl += `&end_date=${endDate}`;
    Promise.all([
      api.get<InvData>(invUrl),
      api.get<Product[]>('/inventory/products'),
    ]).then(([invData, prodData]) => {
      setData(invData);
      setProducts(prodData);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  }, [i18n.language, mode, startDate, endDate, targetDays]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setShowModal(true); };

  const handleSave = async () => {
    if (editing) {
      const payload: Record<string, unknown> = {};
      if (form.product_name !== editing.product_name) payload.product_name = form.product_name;
      if (form.category !== editing.category) payload.category = form.category;
      if (form.unit_cost !== editing.unit_cost) payload.unit_cost = form.unit_cost;
      if (form.unit_price !== editing.unit_price) payload.unit_price = form.unit_price;
      await api.put(`/inventory/products/${editing.product_code}`, payload);
    } else {
      await api.post<Product>('/inventory/products', form);
    }
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm(i18n.language === 'ar' ? `حذف المنتج ${code}؟` : `Delete product ${code}?`)) return;
    await api.del(`/inventory/products/${code}`);
    fetchData();
  };

  const statusLabels: Record<string, string> = {
    out_of_stock: i18n.language === 'ar' ? 'نفد المخزون' : 'Out of Stock',
    low: i18n.language === 'ar' ? 'منخفض' : 'Low',
    overstocked: i18n.language === 'ar' ? 'زائد' : 'Overstocked',
    normal: i18n.language === 'ar' ? 'طبيعي' : 'Normal',
  };

  const badgeVariant = (status: string) => {
    if (status === 'out_of_stock') return 'out_of_stock' as const;
    if (status === 'low') return 'low' as const;
    if (status === 'overstocked') return 'overstocked' as const;
    return 'normal' as const;
  };

  if (loading) return <div className="page"><h2>{i18n.language === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}</h2><div className="card-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></div>;
  if (error) return <div className="page"><h2>{i18n.language === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}</h2><p className="error">{error}</p></div>;
  if (!data) return null;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2>{i18n.language === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className="toggle-group">
            <button className={`toggle-btn ${mode === 'value' ? 'active' : ''}`} onClick={() => setMode('value')}>{i18n.language === 'ar' ? 'قيمة' : 'Value'}</button>
            <button className={`toggle-btn ${mode === 'quantity' ? 'active' : ''}`} onClick={() => setMode('quantity')}>{i18n.language === 'ar' ? 'كمية' : 'Quantity'}</button>
          </div>
          <Button onClick={openAdd}>{i18n.language === 'ar' ? '+ إضافة منتج' : '+ Add Product'}</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          {i18n.language === 'ar' ? 'أيام التخزين' : 'Stock Days'}
          <input type="number" min={1} max={365} value={targetDays} onChange={e => setTargetDays(Math.max(1, +e.target.value || 30))} style={{ width: 60, padding: '0.3rem 0.5rem', border: '1px solid var(--border)' }} />
        </label>
      </div>

      {data.summary && (
        <div className="card-grid">
          <Card title={i18n.language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'} value={(data.summary.total_products ?? 0).toLocaleString(locale)} />
          <Card title={i18n.language === 'ar' ? 'قيمة المخزون' : 'Stock Value'} value={(data.summary.total_stock_value ?? 0).toLocaleString(locale)} />
          <Card title={i18n.language === 'ar' ? 'إجمالي الكميات' : 'Total Items'} value={(data.summary.total_items ?? 0).toLocaleString(locale)} />
          <Card variant="out" title={i18n.language === 'ar' ? 'نفد المخزون' : 'Out of Stock'} value={data.summary.out_of_stock_count ?? 0} />
          <Card variant="low" title={i18n.language === 'ar' ? 'مخزون منخفض' : 'Low Stock'} value={data.summary.low_stock_count ?? 0} />
          <Card variant="over" title={i18n.language === 'ar' ? 'مخزون زائد' : 'Overstocked'} value={data.summary.overstocked_count ?? 0} />
        </div>
      )}

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

      <h3>{i18n.language === 'ar' ? 'منتجات' : 'Products'} ({products.length})</h3>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>{i18n.language === 'ar' ? 'الكود' : 'Code'}</th>
            <th>{i18n.language === 'ar' ? 'الاسم' : 'Name'}</th>
            <th>{i18n.language === 'ar' ? 'التصنيف' : 'Category'}</th>
            <th>{i18n.language === 'ar' ? 'التكلفة' : 'Cost'}</th>
            <th>{i18n.language === 'ar' ? 'السعر' : 'Price'}</th>
            <th>{i18n.language === 'ar' ? 'إجراءات' : 'Actions'}</th>
          </tr></thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>{p.product_code}</td>
                <td>{p.product_name}</td>
                <td>{p.category}</td>
                <td>{p.unit_cost.toFixed(2)}</td>
                <td>{p.unit_price.toFixed(2)}</td>
                <td>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(p)} style={{ marginInlineEnd: '0.5rem' }}>{i18n.language === 'ar' ? 'تعديل' : 'Edit'}</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.product_code)}>{i18n.language === 'ar' ? 'حذف' : 'Delete'}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>{i18n.language === 'ar' ? 'البنود' : 'Items'} ({data.items ? data.items.length : 0})</h3>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>{i18n.language === 'ar' ? 'الكود' : 'Code'}</th>
            <th>{i18n.language === 'ar' ? 'الاسم' : 'Name'}</th>
            <th>{i18n.language === 'ar' ? 'الفرع' : 'Branch'}</th>
            <th>{i18n.language === 'ar' ? 'المخزون' : 'Stock'}</th>
            <th>{i18n.language === 'ar' ? 'المطلوب شراؤه' : 'Req. Purchase'}</th>
            <th>{i18n.language === 'ar' ? 'التوصيات' : 'Recommendations'}</th>
          </tr></thead>
          <tbody>
            {data.items && data.items.map((item, i) => {
              const rpq = item.required_purchase_qty ?? 0;
              const ads = item.avg_daily_sales ?? 0;
              const mos = item.months_of_stock ?? 0;
              const aiRec = item.recommendation;
              let rec = '';
              if (aiRec) {
                rec = aiRec;
              } else if (item.status === 'out_of_stock') {
                const urgent = Math.ceil(ads * (data.target_days || 30));
                rec = i18n.language === 'ar'
                  ? `نفد المخزون! يجب شراء ${urgent} وحدة فوراً`
                  : `Out of stock! Purchase ${urgent} units urgently`;
              } else if (item.status === 'low') {
                rec = i18n.language === 'ar'
                  ? `مخزون منخفض (${mos} شهر). اشترِ ${rpq} وحدة لتصل لمخزون ${data.target_days || 30} يوم`
                  : `Low stock (${mos} mo). Purchase ${rpq} units for ${data.target_days || 30}-day target`;
              } else if (item.status === 'overstocked') {
                rec = i18n.language === 'ar'
                  ? `مخزون زائد (${mos} شهر). لا حاجة للشراء. فكر بتخفيضات أو نقل`
                  : `Overstocked (${mos} mo). No purchase needed. Consider promotions or transfers`;
              } else {
                rec = i18n.language === 'ar'
                  ? `مخزون كافٍ (${mos} شهر). لا حاجة للشراء حالياً`
                  : `Adequate (${mos} mo). No purchase needed`;
              }
              return (
                <tr key={i}>
                  <td>{item.product_code}</td><td>{item.product_name}</td>
                  <td>{item.branch_code}</td>
                  <td>{item.closing_stock}</td>
                  <td>{rpq > 0 ? rpq : '—'}</td>
                  <td>
                    <Badge variant={badgeVariant(item.status)} style={{ marginInlineEnd: '0.4rem' }}>{statusLabels[item.status] || item.status.replace(/_/g, ' ')}</Badge>
                    {rec}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? (i18n.language === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (i18n.language === 'ar' ? 'إضافة منتج' : 'Add Product')} onConfirm={handleSave} confirmText={i18n.language === 'ar' ? 'حفظ' : 'Save'} cancelText={i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}>
        <div className="modal-form">
          <Input label={i18n.language === 'ar' ? 'الكود' : 'Code'} value={form.product_code} onChange={e => setForm({...form, product_code: e.target.value})} disabled={!!editing} />
          <Input label={i18n.language === 'ar' ? 'الاسم' : 'Name'} value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} />
          <Input label={i18n.language === 'ar' ? 'التصنيف' : 'Category'} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          <Input label={i18n.language === 'ar' ? 'التكلفة' : 'Cost'} type="number" step="0.01" value={form.unit_cost} onChange={e => setForm({...form, unit_cost: +e.target.value})} />
          <Input label={i18n.language === 'ar' ? 'السعر' : 'Price'} type="number" step="0.01" value={form.unit_price} onChange={e => setForm({...form, unit_price: +e.target.value})} />
        </div>
      </Modal>
    </div>
  );
};

export default InventoryPage;
