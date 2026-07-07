import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PROVIDER_DEFS, ProviderConfig, getProviderDef, mergeWithDefaults } from '../services/providers';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { i18n } = useTranslation();

  // Providers
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string>('openai');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [testing, setTesting] = useState(false);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const fetchProviders = useCallback(async () => {
    try {
      const r = await fetch('/api/v1/settings');
      if (r.ok) {
        const d = await r.json();
        setProviders(mergeWithDefaults(d.providers || []));
      }
    } catch {}
  }, []);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const selected = providers.find(p => p.id === selectedId) || providers[0];
  const selectedDef = getProviderDef(selectedId);

  const updateSelected = (patch: Partial<ProviderConfig>) => {
    setProviders(prev => prev.map(p => p.id === selectedId ? { ...p, ...patch } : p));
  };

  // Save
  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const r = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providers }),
      });
      if (r.ok) {
        setSaveMsg(i18n.language === 'ar' ? 'تم الحفظ ✅' : 'Saved ✅');
      } else {
        setSaveMsg(i18n.language === 'ar' ? 'فشل الحفظ' : 'Save failed');
      }
    } catch { setSaveMsg(i18n.language === 'ar' ? 'خطأ' : 'Error'); }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // Reset / Defaults
  const handleReset = () => { fetchProviders(); setSaveMsg(i18n.language === 'ar' ? 'تمت الإعادة' : 'Reset'); };

  const handleRestoreDefaults = async () => {
    try {
      const r = await fetch('/api/v1/settings/reset-defaults', { method: 'POST' });
      if (r.ok) { const d = await r.json(); setProviders(mergeWithDefaults(d.providers || [])); }
    } catch {}
  };

  // Test connection
  const handleTestConnection = async () => {
    if (!selected) return;
    setTesting(true); setTestResult(null);
    try {
      const r = await fetch('/api/v1/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selected),
      });
      if (r.ok) setTestResult(await r.json());
      else setTestResult({ success: false, message: 'Server error' });
    } catch { setTestResult({ success: false, message: 'Network error' }); }
    setTesting(false);
  };

  // Fetch models
  const handleFetchModels = async () => {
    if (!selected) return;
    setFetchingModels(true);
    try {
      const r = await fetch('/api/v1/settings/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selected),
      });
      if (r.ok) {
        const d = await r.json();
        if (d.models) updateSelected({ models: d.models });
        if (d.error) setTestResult({ success: false, message: d.error });
      }
    } catch {}
    setFetchingModels(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-account-bar">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          ⚙️ {i18n.language === 'ar' ? 'الإعدادات' : 'Settings'}
        </h2>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <h3 className="settings-sidebar-title">
            {i18n.language === 'ar' ? 'مزودي AI' : 'AI Providers'}
          </h3>
          <div className="settings-provider-list">
            {PROVIDER_DEFS.map(def => {
              const prov = providers.find(p => p.id === def.id);
              const enabled = prov?.enabled ?? false;
              const isSel = selectedId === def.id;
              return (
                <button
                  key={def.id}
                  className={`settings-provider-item ${isSel ? 'active' : ''}`}
                  onClick={() => setSelectedId(def.id)}
                >
                  <span className="settings-provider-logo" style={{ background: def.color }}>{def.logo}</span>
                  <span className="settings-provider-name">{def.name}</span>
                  <div className="settings-provider-meta" style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {prov?.isDefault && <span className="default-badge">{i18n.language === 'ar' ? 'افتراضي' : 'Default'}</span>}
                    <span className={`toggle-dot ${enabled ? 'on' : 'off'}`} onClick={e => { e.stopPropagation(); updateSelected({ enabled: !enabled }); }} />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="settings-panel">
          {selected && selectedDef && (
            <div className="provider-form">
              <div className="provider-form-header">
                <span className="settings-provider-logo large" style={{ background: selectedDef.color }}>{selectedDef.logo}</span>
                <div>
                  <h3>{selectedDef.name}</h3>
                  <p className="provider-desc">{selectedDef.description}</p>
                </div>
                <span className={`toggle-dot large ${selected.enabled ? 'on' : 'off'}`} onClick={() => updateSelected({ enabled: !selected.enabled })} style={{ marginInlineStart: 'auto', cursor: 'pointer' }} />
              </div>

              <div className="form-row">
                <label className="form-label">{i18n.language === 'ar' ? 'تفعيل المزود' : 'Enable Provider'}</label>
                <label className="switch">
                  <input type="checkbox" checked={selected.enabled} onChange={e => updateSelected({ enabled: e.target.checked })} />
                  <span className="slider" />
                </label>
              </div>

              {selectedDef.needsApiKey && (
                <div className="form-row">
                  <label className="form-label">API Key</label>
                  <div className="form-input-group">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={selected.apiKey}
                      onChange={e => updateSelected({ apiKey: e.target.value })}
                      placeholder="sk-..."
                      className="form-input"
                    />
                    <button className="btn-icon" onClick={() => setShowApiKey(!showApiKey)} title={showApiKey ? 'Hide' : 'Show'}>
                      {showApiKey ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              <div className="form-row">
                <label className="form-label">Base URL</label>
                <input
                  type="url"
                  value={selected.baseUrl}
                  onChange={e => updateSelected({ baseUrl: e.target.value })}
                  placeholder="https://api.openai.com/v1"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <label className="form-label">{i18n.language === 'ar' ? 'الموديل' : 'Model'}</label>
                <div className="form-input-group">
                  {selected.models && selected.models.length > 0 ? (
                    <select
                      value={selected.model}
                      onChange={e => updateSelected({ model: e.target.value })}
                      className="form-input form-select"
                    >
                      <option value="">{i18n.language === 'ar' ? 'اختر موديل...' : 'Select model...'}</option>
                      {selected.models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selected.model}
                      onChange={e => updateSelected({ model: e.target.value })}
                      placeholder="gpt-4o, gemini-2.5-pro..."
                      className="form-input"
                    />
                  )}
                  {selectedDef.supportsFetchModels && (
                    <button className="btn-sm" onClick={handleFetchModels} disabled={fetchingModels || !selected.baseUrl}>
                      {fetchingModels ? '...' : (i18n.language === 'ar' ? 'جلب' : 'Fetch')}
                    </button>
                  )}
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Temperature <span className="form-value">{selected.temperature.toFixed(2)}</span></label>
                <input type="range" min={0} max={2} step={0.05} value={selected.temperature} onChange={e => updateSelected({ temperature: +e.target.value })} className="form-slider" />
              </div>

              <div className="form-row">
                <label className="form-label">Max Tokens</label>
                <input type="number" min={1} max={999999} value={selected.maxTokens} onChange={e => updateSelected({ maxTokens: +e.target.value || 4096 })} className="form-input form-input-narrow" />
              </div>

              <div className="form-row">
                <label className="form-label">Top P <span className="form-value">{selected.topP.toFixed(2)}</span></label>
                <input type="range" min={0} max={1} step={0.05} value={selected.topP} onChange={e => updateSelected({ topP: +e.target.value })} className="form-slider" />
              </div>

              <div className="form-row">
                <label className="form-label">{i18n.language === 'ar' ? 'المهلة (ثوانٍ)' : 'Timeout (s)'}</label>
                <input type="number" min={1} max={300} value={selected.timeout} onChange={e => updateSelected({ timeout: +e.target.value || 30 })} className="form-input form-input-narrow" />
              </div>

              <div className="form-row">
                <label className="form-label">Streaming</label>
                <label className="switch">
                  <input type="checkbox" checked={selected.streaming} onChange={e => updateSelected({ streaming: e.target.checked })} />
                  <span className="slider" />
                </label>
              </div>

              <div className="form-actions">
                <button className="btn-sm" onClick={handleTestConnection} disabled={testing || !selected.baseUrl}>
                  {testing ? '...' : '🔌'} {i18n.language === 'ar' ? 'اختبار الاتصال' : 'Test Connection'}
                </button>
                <button className="btn-sm" onClick={() => { setProviders(prev => prev.map(p => ({ ...p, isDefault: p.id === selectedId }))); }}>
                  ★ {i18n.language === 'ar' ? 'تعيين افتراضي' : 'Set as Default'}
                </button>
              </div>
              {testResult && (
                <div className={`test-result ${testResult.success ? 'success' : 'fail'}`}>
                  {testResult.success ? '✅' : '❌'} {testResult.message}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <div className="settings-bottom-bar">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? '...' : '💾'} {i18n.language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          {i18n.language === 'ar' ? 'إعادة تعيين' : 'Reset'}
        </button>
        <button className="btn-secondary" onClick={handleRestoreDefaults}>
          {i18n.language === 'ar' ? 'استعادة الإعدادات الافتراضية' : 'Restore Defaults'}
        </button>
        {saveMsg && <span className="save-msg">{saveMsg}</span>}
      </div>
    </div>
  );
};

export default SettingsPage;
