import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../components/ui';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChatPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lang: i18n.language }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'No response' }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <h2>{i18n.language === 'ar' ? 'محادثة ذكاء المخزون' : 'AI Inventory Chat'}</h2>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
            {i18n.language === 'ar'
              ? 'اسأل أي سؤال عن المخزون، المبيعات، التوقعات، أو التوصيات'
              : 'Ask any question about inventory, sales, forecasts, or recommendations'}
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              maxWidth: '75%',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-primary)',
              color: m.role === 'user' ? 'white' : 'var(--text-primary)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border, rgba(0,0,0,0.1))',
              whiteSpace: 'pre-wrap',
              fontSize: '0.9rem',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border, rgba(0,0,0,0.1))' }}>
              <span className="btn-spinner" style={{ display: 'inline-block' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={i18n.language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border, rgba(0,0,0,0.15))',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
          }}
        />
        <Button onClick={handleSend} disabled={!question.trim() || loading}>
          {i18n.language === 'ar' ? 'إرسال' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default AiChatPage;
