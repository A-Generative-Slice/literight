import React, { useState, useRef } from 'react';
import { C, Logo, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';
import { useSearchParams } from 'react-router-dom';

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
const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      background: '#fff1f2', border: '1.5px solid #fca5a5',
      borderLeft: '4px solid #e11d48', borderRadius: 10,
      padding: '14px 16px', animation: 'slideInErr 0.25s ease'
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#9f1239', lineHeight: 1.5 }}>{message}</span>
    </div>
  );
};


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
      // Logic handled by App.jsx through store update
    } else {
      const msg = result.error || '';
      const isAlreadyExists = msg.toLowerCase().includes('already exists');
      const isNotFound = msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('sign up');
      if (isAlreadyExists) {
        setConflictModal('already-exists');
      } else if (isNotFound) {
        setConflictModal('not-found');
      } else {
        setErr(msg || 'Authentication failed');
      }
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.username) {
      setErr('Please enter your email address.');
      return;
    }
    const result = await requestPasswordReset(form.username);
    if (result.success) {
      setStep('forgot-reset');
    } else {
      const msg = result.error || '';
      if (msg.toLowerCase().includes('not found')) {
        setErr('No account found with this email. Please sign up first.');
      } else {
        setErr(msg || 'Something went wrong. Please try again.');
      }
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirmPassword) {
      setErr('New passwords do not match.');
      return;
    }
    const success = await submitPasswordReset(form.username, form.otp, form.password);
    if (success) {
      setStep('auth');
      setTab('login');
      setForm({ ...form, password: '', confirmPassword: '', otp: '' });
    } else {
      setErr('Invalid security code. Please try again.');
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

      {/* Conflict Modal Overlay */}
      {conflictModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 40, maxWidth: 400, width: '100%',
            textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
            animation: 'fadeUp 0.3s ease'
          }}>
            {conflictModal === 'already-exists' ? (
              <>
                <div style={{ width: 64, height: 64, background: '#fff1f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Account Already Exists</h3>
                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                  An account with <strong style={{ color: '#0f172a' }}>{form.username}</strong> is already registered.<br/>Please log in to continue.
                </p>
                <button
                  onClick={() => { setConflictModal(null); setTab('login'); setErr(''); }}
                  style={{ width: '100%', background: '#e11d48', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}
                >
                  Go to Log In
                </button>
                <button onClick={() => setConflictModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Dismiss</button>
              </>
            ) : (
              <>
                <div style={{ width: 64, height: 64, background: '#fff1f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Account Not Found</h3>
                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                  No account exists for <strong style={{ color: '#0f172a' }}>{form.username}</strong>.<br/>Create a new account to get started.
                </p>
                <button
                  onClick={() => { setConflictModal(null); setTab('signup'); setErr(''); }}
                  style={{ width: '100%', background: '#e11d48', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}
                >
                  Create an Account
                </button>
                <button onClick={() => setConflictModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Dismiss</button>
              </>
            )}
          </div>
        </div>
      )}
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
                <Field label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder={tab === 'signup' ? "Create a strong password" : "••••••••"} required />
                
                {tab === 'signup' && (
                  <Field label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} icon="shield-check" placeholder="Retype your password" required />
                )}

                {tab === 'login' && (
                  <div style={{ textAlign: 'right', marginTop: -14 }}>
                    <button type="button" onClick={() => { setErr(''); setStep('forgot-request'); }} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                      Forgot Password?
                    </button>
                  </div>
                )}
                
                <ErrorBanner message={err} />
                

                <Btn full size="lg" type="submit" style={{ height: 56, fontSize: 16 }}>
                  {tab === 'login' ? 'Continue' : 'Sign Up'}
                </Btn>
              </form>
            </>
          ) : step === 'otp' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: C.accentLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Icon name="shield-check" size={32} color={C.accent} />
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                {otpContext === 'login' ? 'Verify Your Identity' : 'Check your inbox'}
              </h2>
              <p style={{ color: C.muted, fontSize: 15, marginBottom: 8, lineHeight: 1.5 }}>
                {otpContext === 'resend'
                  ? <>This email is registered but not yet verified. We've resent a code to <strong style={{ color: C.text }}>{form.username}</strong></>
                  : otpContext === 'login'
                  ? <>Your account isn't verified yet. Enter the code sent to <strong style={{ color: C.text }}>{form.username}</strong> to complete verification.</>
                  : <>We've sent a 6-digit verification code to <strong style={{ color: C.text }}>{form.username}</strong></>
                }
              </p>
              
              <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={handleOtpVerify} />
              
              <ErrorBanner message={err} />
              
              <Btn full size="lg" onClick={() => handleOtpVerify(form.otp)} style={{ height: 56, fontSize: 16, marginBottom: 20 }}>
                Complete Registration & Start Learning
              </Btn>

              <button type="button" onClick={() => setStep('auth')} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                Didn't get a code? <span style={{ color: C.accent }}>Resend</span>
              </button>
            </div>
          ) : step === 'forgot-request' ? (
            <form onSubmit={handleForgotRequest} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Reset Password</h2>
                <p style={{ color: C.muted, fontSize: 14 }}>Enter your registered email to receive a recovery code.</p>
              </div>
              <Field label="Email Address" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} icon="mail" placeholder="designer@example.com" required />
              
              <ErrorBanner message={err} />
              
              <Btn full size="lg" type="submit" style={{ height: 56, fontSize: 16 }}>
                Send Recovery Code
              </Btn>
              
              <button type="button" onClick={() => setStep('auth')} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                ← Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotReset} style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800 }}>Create New Password</h2>
              <p style={{ color: C.muted, fontSize: 14, marginTop: -16 }}>Enter the 6-digit code sent to {form.username}</p>
              
              <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={() => {}} />
              
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Field label="New Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder="Create a strong password" required />
                <Field label="Confirm New Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} icon="shield-check" placeholder="Retype your new password" required />
              </div>

              <ErrorBanner message={err} />
              
              <Btn full size="lg" type="submit" style={{ height: 56, fontSize: 16 }}>
                Reset & Log In
              </Btn>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
