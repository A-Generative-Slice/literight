import React, { useState, useRef } from 'react';
import { C, Logo } from '../components/Common';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthPage = ({ onBack }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(searchParams.get('tab') === 'login' ? 'login' : 'signup');
  const [step, setStep] = useState('auth'); // auth, otp, forgot, reset
  const [form, setForm] = useState({ username: '', name: '', password: '', confirmPassword: '', otp: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  
  const login = useLmsStore(state => state.login);
  const signup = useLmsStore(state => state.signup);
  const verifyOtp = useLmsStore(state => state.verifyOtp);
  const requestPasswordReset = useLmsStore(state => state.requestPasswordReset);
  const submitPasswordReset = useLmsStore(state => state.submitPasswordReset);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErr('');
    if (tab === 'signup' && form.password !== form.confirmPassword) return setErr('Passwords do not match.');
    
    const action = tab === 'signup' ? signup : login;
    const result = await action(form.username, form.password); 
    
    if (result.requiresVerification) {
      setStep('otp');
    } else if (!result.success) {
      setErr(result.error || 'Authentication failed');
    } else {
      // Success is handled by store/App.jsx redirect
    }
  };

  const handleOtpVerify = async (code) => {
    setErr('');
    const success = await verifyOtp(form.username, code || form.otp);
    if (!success) setErr('Invalid security code. Please try again.');
  };

  const handleForgotReq = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('Sending recovery code...');
    const res = await requestPasswordReset(form.username);
    if (res.success) {
      setMsg('');
      setStep('reset');
    } else {
      setMsg('');
      setErr(res.error || 'Failed to send recovery code');
    }
  };

  const handleResetSub = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirmPassword) return setErr('Passwords do not match.');
    
    setMsg('Updating password...');
    const success = await submitPasswordReset(form.username, form.otp, form.password);
    if (success) {
      setMsg('Password updated! You can now log in.');
      setStep('auth');
      setTab('login');
      setForm({ ...form, password: '', confirmPassword: '', otp: '' });
    } else {
      setMsg('');
      setErr('Failed to reset password. Check your code.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '100px 24px 60px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Two-Line Logo to prevent Mobile overlap */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Logo size="lg" stacked />
          <p style={{ color: '#444', marginTop: 16, fontSize: 10, fontWeight: 900, letterSpacing: '0.4em' }}>GLOBAL VANGUARD OF LIGHTING</p>
        </div>

        <div className="glass" style={{ padding: 'clamp(24px, 10vw, 60px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {step === 'auth' && (
            <>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 50 }}>
                {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, l]) => (
                  <button key={t} onClick={() => { setTab(t); setErr(''); }}
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
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <DarkField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder="••••••••" required />
                  {tab === 'login' && (
                    <button type="button" onClick={() => setStep('forgot')} style={{ background: 'none', border: 'none', color: '#666', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em', alignSelf: 'flex-start', cursor: 'pointer', padding: 0 }}>
                      FORGOT PASSWORD?
                    </button>
                  )}
                </div>
                
                {tab === 'signup' && (
                  <DarkField label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} icon="shield-check" placeholder="••••••••" required />
                )}

                <MsgBanner message={msg} />
                <ErrorBanner message={err} />
                <button type="submit" style={{ background: '#fff', color: '#000', border: 'none', padding: '20px', fontSize: 13, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}>
                  {tab === 'login' ? 'ENTER ACADEMY' : 'START MY JOURNEY'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <div className="reveal" style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12, textTransform: 'uppercase' }}>Verify Email</h2>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 40 }}>We've sent a code to {form.username}</p>
              <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={handleOtpVerify} />
              <ErrorBanner message={err} />
              <button onClick={() => handleOtpVerify(form.otp)} style={{ background: '#fff', color: '#000', border: 'none', padding: '20px', width: '100%', marginTop: 24, fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>VERIFY ACCOUNT</button>
              <button onClick={() => setStep('auth')} style={{ marginTop: 20, background: 'none', border: 'none', color: '#444', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>BACK</button>
            </div>
          )}

          {step === 'forgot' && (
            <div className="reveal">
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12, textTransform: 'uppercase' }}>Recover Access</h2>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 40 }}>Enter your email to receive a recovery code.</p>
              <form onSubmit={handleForgotReq} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <DarkField label="Email Address" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} icon="mail" placeholder="DESIGNER@ACADEMY.COM" required />
                <MsgBanner message={msg} />
                <ErrorBanner message={err} />
                <button type="submit" style={{ background: '#fff', color: '#000', border: 'none', padding: '20px', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>SEND RECOVERY CODE</button>
                <button type="button" onClick={() => setStep('auth')} style={{ background: 'none', border: 'none', color: '#444', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>BACK TO LOGIN</button>
              </form>
            </div>
          )}

          {step === 'reset' && (
            <div className="reveal">
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12, textTransform: 'uppercase' }}>New Credentials</h2>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 40 }}>Enter the code from your email and your new password.</p>
              <form onSubmit={handleResetSub} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ marginBottom: 20 }}>
                   <label style={{ fontSize: 9, fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 16 }}>RECOVERY CODE</label>
                   <OTPInput onChange={v => setForm({ ...form, otp: v })} onComplete={() => {}} />
                </div>
                <DarkField label="New Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} icon="key" placeholder="••••••••" required />
                <DarkField label="Confirm New Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} icon="shield-check" placeholder="••••••••" required />
                <MsgBanner message={msg} />
                <ErrorBanner message={err} />
                <button type="submit" style={{ background: '#fff', color: '#000', border: 'none', padding: '20px', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>UPDATE PASSWORD</button>
              </form>
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
        <input key={i} ref={refs[i]} value={d} maxLength={1} onChange={e => handle(i, e.target.value)} style={{ width: 'clamp(30px, 8vw, 40px)', height: 50, textAlign: 'center', fontSize: 24, fontWeight: 900, border: 'none', borderBottom: '2px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', outline: 'none' }} />
      ))}
    </div>
  );
};

const ErrorBanner = ({ message }) => message ? (
  <div className="reveal" style={{ color: '#ff4444', fontSize: 11, fontWeight: 900, textAlign: 'center', letterSpacing: '0.1em' }}>{message.toUpperCase()}</div>
) : null;

const MsgBanner = ({ message }) => message ? (
  <div className="reveal" style={{ color: '#fff', fontSize: 11, fontWeight: 900, textAlign: 'center', letterSpacing: '0.1em', opacity: 0.8 }}>{message.toUpperCase()}</div>
) : null;

export default AuthPage;
