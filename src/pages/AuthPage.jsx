import React, { useState, useRef } from 'react';
import { C, Logo, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';

const OTPInput = ({ onChange }) => {
  const len = 6;
  const [digits, setDigits] = useState(Array(len).fill(''));
  const refs = Array.from({ length: len }, () => useRef(null));
  const handle = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    onChange(next.join(''));
    if (v && i < len - 1) refs[i + 1].current?.focus();
  };
  const keyDown = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus(); };
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input key={i} ref={refs[i]} value={d} maxLength={1} onChange={e => handle(i, e.target.value)} onKeyDown={e => keyDown(i, e)}
          style={{ width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700, border: `1.5px solid ${d ? C.accent : C.border}`, borderRadius: 8, background: d ? C.accentLight : C.surface, color: C.accent, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
      ))}
    </div>
  );
};

const AuthPage = ({ onBack }) => {
  const [tab, setTab] = useState('login');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', password: '', email: '', otp: '', first: '', last: '', photo: null });
  const [err, setErr] = useState('');
  const login = useLmsStore(state => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(form.username, form.password);
    if (!success) setErr('Invalid credentials');
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.surface} 0%, #ffffff 50%, ${C.accentLight} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Logo size="lg" />
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        </div>

        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 6, marginBottom: 28, border: `1px solid ${C.border}` }}>
          {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, l]) => (
            <button key={t} onClick={() => { setTab(t); setStep(1); }}
              style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer', borderRadius: 8, fontSize: 14, fontWeight: 800, background: tab === t ? '#fff' : 'transparent', color: tab === t ? C.accent : C.muted }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <Card padding="32px">
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Field label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} icon="user" required />
              <Field label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" required />
              {err && <div style={{ color: C.danger, fontSize: 13 }}>{err}</div>}
              <Btn full size="lg" type="submit">Log In</Btn>
            </form>
          )}

          {tab === 'signup' && (
            <div style={{ textAlign: 'center' }}>
              <p>Sign up is disabled for v1 production. Please contact Admin.</p>
              <Btn variant="secondary" onClick={() => setTab('login')}>Go to Login</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
