import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '../components/ui';

const UploadPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [files, setFiles] = useState<{ inventory?: File; sales?: File }>({});
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ inventory?: string; sales?: string }>({});
  const [preview, setPreview] = useState<any[] | null>(null);

  const handleFile = (type: 'inventory' | 'sales') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [type]: file }));
    setResults(prev => ({ ...prev, [type]: undefined }));

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1, 6).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
        return obj;
      });
      setPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleUpload = async (type: 'inventory' | 'sales') => {
    const file = files[type];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/v1/upload/${type}`, { method: 'POST', body: formData });
      const data = await res.json();
      setResults(prev => ({ ...prev, [type]: data.message || data.detail || 'Uploaded' }));
    } catch (err: any) {
      setResults(prev => ({ ...prev, [type]: `Error: ${err.message}` }));
    }
    setUploading(false);
  };

  const statusBadge = (result?: string) => {
    if (!result) return null;
    const isErr = result.startsWith('Error');
    return <Badge variant={isErr ? 'danger' : 'success'}>{isErr ? '✗' : '✓'} {result}</Badge>;
  };

  return (
    <div className="page">
      <h2>{i18n.language === 'ar' ? 'رفع الملفات' : 'Upload Data'}</h2>
      <p className="meta">{i18n.language === 'ar' ? 'رفع ملفات CSV للمخزون والمبيعات' : 'Upload CSV files for inventory and sales data'}</p>

      <div className="card-grid" style={{ maxWidth: 700, margin: '0 auto' }}>
        <Card title={i18n.language === 'ar' ? 'بيانات المخزون' : 'Inventory Data'}>
          <input type="file" accept=".csv" onChange={handleFile('inventory')} style={{ marginBottom: '0.5rem', display: 'block' }} />
          {files.inventory && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {files.inventory.name} ({(files.inventory.size / 1024).toFixed(1)} KB)
            </div>
          )}
          <Button onClick={() => handleUpload('inventory')} disabled={!files.inventory || uploading} size="sm">
            {uploading ? '...' : i18n.language === 'ar' ? 'رفع' : 'Upload'}
          </Button>
          {statusBadge(results.inventory)}
        </Card>

        <Card title={i18n.language === 'ar' ? 'بيانات المبيعات' : 'Sales Data'}>
          <input type="file" accept=".csv" onChange={handleFile('sales')} style={{ marginBottom: '0.5rem', display: 'block' }} />
          {files.sales && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {files.sales.name} ({(files.sales.size / 1024).toFixed(1)} KB)
            </div>
          )}
          <Button onClick={() => handleUpload('sales')} disabled={!files.sales || uploading} size="sm">
            {uploading ? '...' : i18n.language === 'ar' ? 'رفع' : 'Upload'}
          </Button>
          {statusBadge(results.sales)}
        </Card>
      </div>

      {preview && (
        <>
          <h3>{i18n.language === 'ar' ? 'معاينة البيانات' : 'Data Preview'}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr>
                {Object.keys(preview[0] || {}).map(h => <th key={h}>{h}</th>)}
              </tr></thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{String(v)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadPage;
