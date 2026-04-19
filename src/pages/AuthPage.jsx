import React, { useState, useRef } from 'react';
import { C, Logo, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';
import { useSearchParams } from 'react-router-dom';





const AuthPage = ({ onBack }) => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'login' ? 'login' : 'signup');
  const [step, setStep] = useState('auth');
  const [otpContext, setOtpContext] = useState('signup');
  const [form, setForm] = useState({ username: '', name: '', password: '', confirmPassword: '', otp: '' });
  const [err, setErr] = useState('');
  const [conflictModal, setConflictModal] = useState(null); // null | 'already-exists' | 'not-found'
  
  const login = useLmsStore(state => state.login);
  const signup = useLmsStore(state => state.signup);
  const verifyOtp = useLmsStore(state => state.verifyOtp);
  const requestPasswordReset = useLmsStore(state => state.requestPasswordReset);
  const submitPasswordReset = useLmsStore(state => state.submitPasswordReset);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErr('');

    if (tab === 'signup' && form.password !== form.confirmPassword) {
      setErr('Passwords do not match.');
      return;
    }

    const action = tab === 'signup' ? signup : login;
    const result = await action(form.username, form.password); 
    
    if (result.requiresVerification) {
      setOtpContext(result.context || 'signup');
      setStep('otp');
    } else if (result.success) {
      // Logic handled by App.jsx
    } else {
      const msg = result.error || '';
      if (msg.toLowerCase().includes('already exists')) setConflictModal('already-exists');
      else if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('sign up')) setConflictModal('not-found');
      else setErr(msg || 'Authentication failed');
    }
  };

  const handleOtpVerify = async (code) => {
    setErr('');
    const success = await verifyOtp(form.username, code || form.otp);
    if (!success) setErr('Invalid security code. Please try again.');
  };

  return (
    <div className="md-p-4" style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradients */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(190,18,60,0.15) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(190,18,60,0.1) 0%, transparent 70%)' }} />

      {/* Conflict Modal Overlay */}
      {conflictModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Card glass padding="48px" className="reveal" style={{ maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(190,18,60,0.1)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Icon name={conflictModal === 'already-exists' ? "user" : "alert-circle"} size={32} color={C.accent} />
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
              {conflictModal === 'already-exists' ? 'Account Found' : 'No Account Found'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              {conflictModal === 'already-exists' 
                ? <>An account with <strong style={{color: '#fff'}}>{form.username}</strong> already exists. Please sign in to proceed.</>
                : <>The email <strong style={{color: '#fff'}}>{form.username}</strong> is not registered. Sign up to get started!</>
              }
            </p>
            <Btn full size="lg" onClick={() => { setConflictModal(null); setTab(conflictModal === 'already-exists' ? 'login' : 'signup'); setErr(''); }}>
              {conflictModal === 'already-exists' ? 'Go to Sign In' : 'Create Account Now'}
            </Btn>
            <button onClick={() => setConflictModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', fontWeight: 700, marginTop: 20 }}>Dismiss</button>
          </Card>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }} className="reveal">
          <Logo size="lg" />
          <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 16, fontWeight: 500, letterSpacing: '0.01em' }}>Join the Global Vanguard of Lighting Design</p>
        </div>

        <Card glass padding="clamp(24px, 8vw, 48px)" className="reveal md-p-4" style={{ borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)' }}>
          {step === 'auth' ? (
            <>
              <div style={{ display: 'flex', background: 'rgba(15,23,42,0.6)', borderRadius: 16, padding: 6, marginBottom: 40 }}>
                {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, l]) => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ flex: 1, padding: '14px', border: 'none', cursor: 'pointer', borderRadius: 12, fontSize: 12, fontWeight: 900, background: tab === t ? '#fff' : 'transparent', color: tab === t ? C.accent : '#94a3b8', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', letterSpacing: '0.05em' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {tab === 'signup' && (
                  <DarkField label="Full Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} icon="user" placeholder="Leonardo da Vinci" required />
                )}
                <DarkField label="Email Address" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} icon="mail" placeholder="designer@example.com" required />
                <DarkField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder="••••••••" required />
                
                {tab === 'signup' && (
                  <DarkField label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} icon="shield-check" placeholder="••••••••" required />
                )}

                {tab === 'login' && (
                  <div style={{ textAlign: 'right', marginTop: -16 }}>
                    <button type="button" onClick={() => setStep('forgot-request')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Forgot Password?</button>
                  </div>
                )}
                
                <ErrorBanner message={err} />
                <Btn full size="lg" type="submit" style={{ height: 60, fontSize: 16, borderRadius: 16 }}>{tab === 'login' ? 'Enter Academy' : 'Start My Journey'}</Btn>
              </form>
            </>
          ) : step === 'otp' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: 'rgba(190,18,60,0.1)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <Icon name="shield-check" size={32} color={C.accent} />
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#fff', marginBottom: 12 }}>Check your inbox</h2>
              <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>We've sent a 6-digit verification code to <strong style={{color: '#fff'}}>{form.username}</strong></p>
              
              <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={handleOtpVerify} />
              <ErrorBanner message={err} />
              
              <Btn full size="lg" onClick={() => handleOtpVerify(form.otp)} style={{ height: 60, fontSize: 16, borderRadius: 16, marginTop: 12 }}>Complete Registration</Btn>
              <button type="button" onClick={() => setStep('auth')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', fontWeight: 700, marginTop: 24 }}>Didn't get a code? <span style={{color: C.accent}}>Resend</span></button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: '#fff', marginBottom: 32 }}>Reset Access</h2>
               <form style={{ display: 'flex', flexDirection: 'column', gap: 28, textAlign: 'left' }}>
                  <DarkField label="Email Address" icon="mail" placeholder="Your email..." />
                  <Btn full size="lg" style={{ height: 60, borderRadius: 16 }}>Request Code</Btn>
                  <button type="button" onClick={() => setStep('auth')} style={{ alignSelf: 'center', background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', fontWeight: 700 }}>Back to Sign In</button>
               </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const DarkField = ({ label, icon, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: 4 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}><Icon name={icon} size={16} /></div>
      <input {...props} style={{ width: '100%', background: 'rgba(15,23,42,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', padding: '16px 16px 16px 48px', color: '#fff', outline: 'none', fontSize: 14, transition: 'all 0.3s' }} onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.background = 'rgba(15,23,42,0.6)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.05)'; e.target.style.background = 'rgba(15,23,42,0.4)'; }} />
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
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
      {digits.map((d, i) => (
        <input key={i} ref={refs[i]} value={d} maxLength={1} onChange={e => handle(i, e.target.value)} onKeyDown={e => e.key === 'Backspace' && !d && i > 0 && refs[i - 1].current?.focus()} style={{ width: 50, height: 64, textAlign: 'center', fontSize: 24, fontWeight: 900, border: `2px solid ${d ? C.accent : 'rgba(255,255,255,0.05)'}`, borderRadius: 16, background: 'rgba(15,23,42,0.4)', color: '#fff', outline: 'none', transition: 'all 0.2s' }} />
      ))}
    </div>
  );
};

const ErrorBanner = ({ message }) => message ? (
  <div className="reveal" style={{ display: 'flex', gap: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '14px 18px', borderRadius: 16 }}>
    <Icon name="alert-circle" size={18} color="#ef4444" />
    <span style={{ fontSize: 14, color: '#fca5a5', fontWeight: 600, lineHeight: 1.4 }}>{message}</span>
  </div>
) : null;

export default AuthPage;
