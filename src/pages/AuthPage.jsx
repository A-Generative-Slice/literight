import React, { useState, useRef } from 'react';
import { C, Logo, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';

const OTPInput = ({ onChange, onComplete }) => {
  const len = 6;
  const [digits, setDigits] = useState(Array(len).fill(''));
  const refs = Array.from({ length: len }, () => useRef(null));
  
  const handle = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; 
    next[i] = v; 
    setDigits(next);
    const code = next.join('');
    onChange(code);
    
    if (v && i < len - 1) {
      refs[i + 1].current?.focus();
    }
    
    if (code.length === len) {
      onComplete(code);
    }
  };

  const keyDown = (i, e) => { 
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus(); 
    }
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
      {digits.map((d, i) => (
        <input 
          key={i} 
          ref={refs[i]} 
          value={d} 
          maxLength={1} 
          onChange={e => handle(i, e.target.value)} 
          onKeyDown={e => keyDown(i, e)}
          style={{ 
            width: 48, height: 60, textAlign: 'center', fontSize: 24, fontWeight: 800, 
            border: `2px solid ${d ? C.accent : C.border}`, borderRadius: 12, 
            background: d ? C.accentLight : '#fff', color: C.accent, outline: 'none', 
            fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s'
          }} 
        />
      ))}
    </div>
  );
};

const AuthPage = ({ onBack }) => {
  const [tab, setTab] = useState('login');
  const [step, setStep] = useState('auth'); // 'auth', 'otp'
  const [form, setForm] = useState({ username: '', password: '', otp: '' });
  const [err, setErr] = useState('');
  
  const login = useLmsStore(state => state.login);
  const verifyOtp = useLmsStore(state => state.verifyOtp);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErr('');
    // For this academy, username IS the email for students
    const result = await login(form.username, form.password); 
    
    if (result.requiresVerification) {
      setStep('otp');
    } else if (result.success) {
      // Logic handled by App.jsx through store update
    } else {
      setErr(result.error || 'Invalid credentials');
    }
  };

  const handleOtpVerify = async (code) => {
    setErr('');
    const success = await verifyOtp(form.username, code || form.otp);
    if (!success) {
      setErr('Invalid security code. Please try again.');
    }
  };

  return (
    <div className="md-p-4" style={{ minHeight: '100vh', background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Logo size="lg" />
          <p style={{ color: C.muted, marginTop: 12, fontWeight: 500 }}>The Gateway to Architectural Mastery</p>
        </div>

        <Card padding="40px" className="md-p-4" style={{ border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          {step === 'auth' ? (
            <>
              <div style={{ display: 'flex', background: C.surface, borderRadius: 14, padding: 6, marginBottom: 32 }}>
                {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, l]) => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer', borderRadius: 10, fontSize: 13, fontWeight: 800, background: tab === t ? '#fff' : 'transparent', color: tab === t ? C.accent : C.muted, transition: 'all 0.2s' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {tab === 'signup' && (
                  <Field label="Full Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} icon="user" placeholder="Leonardo da Vinci" required />
                )}
                <Field label="Email Address" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} icon="mail" placeholder="designer@example.com" required />
                <Field label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder="Create a strong password" required />
                
                {err && <div style={{ color: C.danger, fontSize: 13, background: C.danger + '10', padding: '10px 14px', borderRadius: 8, borderLeft: `3px solid ${C.danger}` }}>{err}</div>}
                
                <Btn full size="lg" type="submit" style={{ height: 56, fontSize: 16 }}>
                  {tab === 'login' ? 'Continue' : 'Sign Up'}
                </Btn>
                
                <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                  ← Back to Academy
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: C.accentLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Icon name="shield-check" size={32} color={C.accent} />
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Check your inbox</h2>
              <p style={{ color: C.muted, fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>
                We've sent a 6-digit verification code to <br /><strong style={{ color: C.text }}>{form.username}</strong>
              </p>
              
              <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={handleOtpVerify} />
              
              {err && <div style={{ color: C.danger, fontSize: 13, marginBottom: 20 }}>{err}</div>}
              
              <Btn full size="lg" onClick={() => handleOtpVerify(form.otp)} style={{ height: 56, fontSize: 16, marginBottom: 20 }}>
                Complete Registration & Start Learning
              </Btn>

              <button type="button" onClick={() => setStep('auth')} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                Didn't get a code? <span style={{ color: C.accent }}>Resend</span>
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
