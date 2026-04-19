import React, { useState, useRef } from 'react';
import { C, Logo } from '../components/Common';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';
import { useSearchParams } from 'react-router-dom';

const AuthPage = ({ onBack }) => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'login' ? 'login' : 'signup');
  const [step, setStep] = useState('auth');
  const [form, setForm] = useState({ username: '', name: '', password: '', confirmPassword: '', otp: '' });
  const [err, setErr] = useState('');
  
  const login = useLmsStore(state => state.login);
  const signup = useLmsStore(state => state.signup);
  const verifyOtp = useLmsStore(state => state.verifyOtp);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErr('');
    if (tab === 'signup' && form.password !== form.confirmPassword) return setErr('Passwords do not match.');
    const action = tab === 'signup' ? signup : login;
    const result = await action(form.username, form.password); 
    if (result.requiresVerification) setStep('otp');
    else if (!result.success) setErr(result.error || 'Authentication failed');
  };

  const handleOtpVerify = async (code) => {
    setErr('');
    const success = await verifyOtp(form.username, code || form.otp);
    if (!success) setErr('Invalid security code. Please try again.');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Logo size="lg" />
          <p style={{ color: '#666', marginTop: 12, fontSize: 13, fontWeight: 900, letterSpacing: '0.2em' }}>GLOBAL VANGUARD OF LIGHTING</p>
        </div>

        <div className="glass" style={{ padding: 'clamp(24px, 10vw, 60px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {step === 'auth' ? (
            <>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 50 }}>
                {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, l]) => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ flex: 1, padding: '16px', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 900, background: 'transparent', color: tab === t ? '#fff' : '#444', borderBottom: tab === t ? '2px solid #fff' : '2px solid transparent', transition: 'all 0.3s', letterSpacing: '0.1em' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {tab === 'signup' && (
                  <DarkField label="Full Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} icon="user" placeholder="LEONARDO DA VINCI" required />
                )}
                <DarkField label="Email Address" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} icon="mail" placeholder="DESIGNER@ACADEMY.COM" required />
                <DarkField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder="••••••••" required />
                
                {tab === 'signup' && (
                  <DarkField label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} icon="shield-check" placeholder="••••••••" required />
                )}

                <ErrorBanner message={err} />
                <button type="submit" style={{ background: '#fff', color: '#000', border: 'none', padding: '20px', fontSize: 13, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}>
                  {tab === 'login' ? 'ENTER ACADEMY' : 'START MY JOURNEY'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Check your inbox</h2>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 40 }}>We've sent a code to {form.username}</p>
              <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={handleOtpVerify} />
              <ErrorBanner message={err} />
              <button onClick={() => handleOtpVerify(form.otp)} style={{ background: '#fff', color: '#000', border: 'none', padding: '20px', width: '100%', marginTop: 24, fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>VERIFY ACCOUNT</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DarkField = ({ label, icon, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <label style={{ fontSize: 9, fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input {...props} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '16px 0', color: '#fff', outline: 'none', fontSize: 14, letterSpacing: '0.05em' }} />
    </div>
  </div>
);

const OTPInput = ({ onChange, onComplete }) => {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const refs = Array.from({ length: 6 }, () => useRef(null));
  const handle = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    onChange(next.join(''));
    if (v && i < 5) refs[i + 1].current?.focus();
    if (next.join('').length === 6) onComplete(next.join(''));
  };
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input key={i} ref={refs[i]} value={d} maxLength={1} onChange={e => handle(i, e.target.value)} style={{ width: 40, height: 50, textAlign: 'center', fontSize: 24, fontWeight: 900, border: 'none', borderBottom: '2px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', outline: 'none' }} />
      ))}
    </div>
  );
};

const ErrorBanner = ({ message }) => message ? (
  <div style={{ color: '#ff4444', fontSize: 11, fontWeight: 900, textAlign: 'center', letterSpacing: '0.1em' }}>{message.toUpperCase()}</div>
) : null;

export default AuthPage;
