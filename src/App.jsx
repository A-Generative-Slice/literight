import { useState, useRef, useEffect } from 'react';
import './index.css';
import Syllabus from './components/Syllabus';
import QuizPlayer from './components/QuizPlayer';
import { useProgress } from './hooks/useProgress';

// ── DESIGN TOKENS ─────────────────────────────────────────
const C = {
  bg: '#ffffff',          // white background
  surface: '#f8fafc',     // off-white surface
  border: '#e2e8f0',      // soft light border
  text: '#0f172a',        // deep slate text
  muted: '#64748b',       // slate grey muted
  accent: '#e11d48',      // brand red
  accentLight: '#fff1f2', // light red tint
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
};


// ── MOCK DATA ─────────────────────────────────────────────
const ADMIN_CREDS = { username: 'Admin', password: 'Admin' };

const COURSES = [{
  id: 1,
  title: 'Comprehensive Lighting Design Course',
  instructor: 'Admin',
  trailer: '/trailer.mp4',
  thumbnail: '',
  passPercentage: 80,
  price: 199, originalPrice: 299,
  rating: 4.9, students: 1247,
  duration: '3h 0m', totalLessons: 12,
  description: 'Master the art and science of architectural lighting. This industry-grade curriculum covers physics, human perception, architectural principles, and real-world frameworks for residential and commercial spaces.',
  tags: ['Architecture', 'Professional', 'Lighting'],
  chapters: [
    {
      id: 101,
      title: 'Module 1: The Foundations of Light & Vision',
      lessons: [
        { id: 1011, title: '1.1 The Nature of Light', video: '/lessons/1.1.mp4' },
        { id: 1012, title: '1.2 Human Vision & Perception', video: '/lessons/1.2.mp4' },
        { id: 1013, title: '1.3 Scientific Metrics & Photometry', video: '/lessons/1.3.mp4' }
      ],
      quiz: [
        { id: 1014, question: 'What is the visible light range of the electromagnetic spectrum?', options: ['100-300 nm', '380-780 nm', '800-1200 nm', '10-100 nm'], correct: 1 }
      ]
    },
    {
      id: 102,
      title: 'Module 2: Architectural Lighting & Visual Comfort',
      lessons: [
        { id: 1021, title: '2.1 Principles of Lighting Design', video: '/lessons/2.1.mp4' },
        { id: 1022, title: '2.2 Visual Comfort & Ergonomics', video: '/lessons/2.2.mp4' },
        { id: 1023, title: '2.3 Spatial Perspectives', video: '/lessons/2.3.mp4' }
      ],
      quiz: [
        { id: 1024, question: 'Which of Richard Kelly’s elements refers to task or highlight lighting?', options: ['Ambient luminescence', 'Focal glow', 'Play of brilliants', 'Sparkle'], correct: 1 }
      ]
    },
    {
      id: 103,
      title: 'Module 3: Human Centric Lighting (HCL) & Psychology',
      lessons: [
        { id: 1031, title: '3.1 Biological Impact of Light', video: '/lessons/3.1.mp4' },
        { id: 1032, title: '3.2 The Psychology of Light and Color', video: '/lessons/3.2.mp4' },
        { id: 1033, title: '3.3 Implementing HCL', video: '/lessons/3.3.mp4' }
      ],
      quiz: [
        { id: 1034, question: 'What biological process does light primarily control in humans?', options: ['Digestion', 'Circadian rhythms', 'Muscle growth', 'Hearing'], correct: 1 }
      ]
    },
    {
      id: 104,
      title: 'Module 4: The Environmental Lighting Framework',
      lessons: [
        { id: 1041, title: '4.1 Framework for Residential Spaces', video: '/lessons/4.1.mp4' },
        { id: 1042, title: '4.2 Framework for Outdoor & Transitional Spaces', video: '/lessons/4.2.mp4' },
        { id: 1043, title: '4.3 Framework for Commercial Workspaces', video: '/lessons/4.3.mp4' }
      ],
      quiz: [
        { id: 1044, question: 'Which zone requires specific visual comfort limits for screen productivity?', options: ['Offices', 'Luxury Villas', 'Terraces', 'Beachside Villas'], correct: 0 }
      ]
    }
  ],
}];


// ── SVG ICON ──────────────────────────────────────────────
const PATHS = {
  play: 'M5 3l14 9-14 9V3z',
  'play-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7l5-3-5-3v6z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 17V5a2 2 0 012-2h14l-2 14H6.5z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  credit: 'M1 4h22v16H1zM1 10h22',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7.3-4a7.7 7.7 0 000 2l2 1.7-2 3.5-2.3-.9a7 7 0 01-1.7 1L15 21h-4l-.3-2.4a7 7 0 01-1.7-1l-2.3.9-2-3.5L6.7 13a7.7 7.7 0 010-2L4.7 9.3l2-3.5 2.3.9a7 7 0 011.7-1L11 3h4l.3 2.4a7 7 0 011.7 1l2.3-.9 2 3.5L19.3 11z',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM12 15v2M8 11V7a4 4 0 018 0v4',
  'check-circle': 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  check: 'M20 6L9 17l-5-5',
  plus: 'M12 5v14M5 12h14',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 9 8-9',
  key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.1 11.9a19.79 19.79 0 01-3.07-8.67A2 2 0 013 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 8a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15v1.92z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  x: 'M18 6L6 18M6 6l12 12',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-7v-4m0 5h.01',
  award: 'M12 15a7 7 0 100-14 7 7 0 000 14zm0 0v7m-4-4h8',
  'file-text': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  'chevron-down': 'M6 9l6 6 6-6',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-7v-4m0 5h.01',
};

const Icon = ({ name, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path d={PATHS[name] || PATHS.info} />
  </svg>
);

// ── SHARED COMPONENTS ─────────────────────────────────────

const Logo = ({ size = 'md', light = false }) => {
  const fs = { sm: 16, md: 20, lg: 28 }[size];
  return (
    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: fs, letterSpacing: '-0.02em', userSelect: 'none', color: '#0f172a' }}>
      LITE<span style={{ color: C.accent }}>RIGHT</span>
      <span style={{ fontSize: fs * 0.55, marginLeft: 6, fontWeight: 500, color: '#94a3b8' }}>ACADEMY</span>
    </span>
  );
};

const Badge = ({ label, color = C.accent }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: color + '18', color, border: `1px solid ${color}30` }}>
    {label}
  </span>
);

const Btn = ({ onClick, children, variant = 'primary', size = 'md', full = false, disabled = false, style: ex = {} }) => {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const sizes = { sm: { padding: '7px 14px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '13px 24px', fontSize: 15 } };
  const vars = {
    primary: { background: h ? '#be123c' : C.accent, color: '#fff' },
    secondary: { background: h ? '#e2e8f0' : C.border, color: C.text, border: `1px solid ${C.border}` },
    danger: { background: h ? '#be123c' : C.danger, color: '#fff' },
    ghost: { background: h ? C.accentLight : 'transparent', color: h ? C.accent : C.muted },
    success: { background: h ? '#16a34a' : C.success, color: '#fff' },
  };
  return (
    <button 
      onClick={disabled ? undefined : onClick} 
      onMouseEnter={() => setH(true)} 
      onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{ 
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        transform: disabled ? 'none' : p ? 'scale(0.96)' : h ? 'scale(1.02)' : 'scale(1)',
        boxShadow: h && !disabled ? '0 10px 20px rgba(225,29,72,0.15)' : 'none',
        width: full ? '100%' : 'auto', opacity: disabled ? 0.6 : 1, ...sizes[size], ...vars[variant], ...ex 
      }}>
      {children}
    </button>
  );
};

const Field = ({ label, type = 'text', placeholder, value, onChange, icon, required, maxLength, note, readOnly }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 12, top: '50%', transform: `translateY(-50%) scale(${focused ? 1.1 : 1})`, transition: 'all 0.2s', pointerEvents: 'none' }}><Icon name={icon} size={15} color={focused ? C.accent : C.muted} /></div>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength} required={required} readOnly={readOnly}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: icon ? '11px 14px 11px 40px' : '11px 14px', border: `1.5px solid ${focused ? C.accent : C.border}`, borderRadius: 10, fontSize: 14, color: readOnly ? C.muted : C.text, background: readOnly ? C.surface : focused ? '#fff' : C.surface, outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: focused ? `0 0 0 4px ${C.accent}12` : 'none', fontFamily: 'Inter, sans-serif' }} />
      </div>
      {note && <span style={{ fontSize: 12, color: C.muted }}>{note}</span>}
    </div>
  );
};

const Card = ({ children, style: ex = {}, padding = '24px' }) => (
  <div className="animate-fade-up" style={{ background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(15,23,42,0.04)', padding, transition: 'all 0.3s ease', ...ex }}>
    {children}
  </div>
);

const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    {label && <span style={{ fontSize: 12, color: C.muted }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const Avatar = ({ user, size = 40 }) => {
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  return user?.photo
    ? <img src={user.photo} alt={user.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>{initials}</div>;
};

const Modal = ({ open, onClose, title, children, width = 500 }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: C.surface, borderRadius: 16, width: '100%', maxWidth: width, boxShadow: '0 20px 60px rgba(0,73,255,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4 }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', visible }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 3000, background: type === 'error' ? C.danger : type === 'info' ? C.accent : C.success, color: '#fff', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.3s', pointerEvents: 'none' }}>
    <Icon name={type === 'error' ? 'alert-circle' : 'check-circle'} size={18} color="#fff" />
    {message}
  </div>
);

// OTP input boxes
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
          style={{ width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700, border: `1.5px solid ${d ? C.accent : C.border}`, borderRadius: 8, background: d ? C.accentLight : C.surface, color: C.accent, outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.1s' }} />
      ))}
    </div>
  );
};

// ── PUBLIC NAV ────────────────────────────────────────────
const PublicNav = ({ user, onLoginClick, onLogout, role, setScreen }) => {
  const [drop, setDrop] = useState(false);
  return (
    <nav style={{ background: C.bg, borderBottom: `1px solid #1e1e1e`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div onClick={() => setScreen('public')} style={{ cursor: 'pointer' }}><Logo /></div>
        {['Courses', 'About'].map(l => (
          <button key={l} onClick={() => setScreen('public')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: C.muted, padding: '6px 10px', borderRadius: 6, fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent} onMouseLeave={e => e.currentTarget.style.color = C.muted}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <div onClick={() => setDrop(!drop)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Avatar user={user} size={34} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
              <Icon name="chevron-down" size={14} color={C.muted} />
            </div>
            {drop && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, width: 210, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 200, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid #222` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{user.email || 'Admin'}</div>
                </div>
                {role === 'admin' && (
                  <MenuItem icon="shield" label="Admin Panel" color={C.accent} onClick={() => { setDrop(false); setScreen('admin'); }} />
                )}
                {role === 'student' && (
                  <MenuItem icon="user" label="My Profile" onClick={() => { setDrop(false); setScreen('settings'); }} />
                )}
                <MenuItem icon="logout" label="Log Out" color={C.danger} onClick={() => { setDrop(false); onLogout(); }} />
              </div>
            )}
          </div>
        ) : (
          <>
            <Btn variant="ghost" onClick={onLoginClick}>Log In</Btn>
            <Btn onClick={onLoginClick}>Sign Up Free</Btn>
          </>
        )}
      </div>
    </nav>
  );
};

const MenuItem = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: color || C.text, fontFamily: 'Inter, sans-serif', textAlign: 'left' }}
    onMouseEnter={e => e.currentTarget.style.background = '#ffffff'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <Icon name={icon} size={15} color={color || C.muted} /> {label}
  </button>
);

// ── PUBLIC LANDING ─────────────────────────────────────────
const PublicLanding = ({ onCourse, courses }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
    {/* Hero */}
    <div style={{ margin: '48px 0 56px', padding: '56px', background: `linear-gradient(135deg,#fff 0%,${C.accentLight} 60%,#ffe4e6 100%)`, borderRadius: 20, color: C.text, position: 'relative', overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(225,29,72,0.05)' }} />
      <Badge label="Professional Certification" color="#60a5fa" />
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 800, marginTop: 20, marginBottom: 16, lineHeight: 1.15, maxWidth: 560 }}>
        Master Architectural Lighting Design
      </h1>
      <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.65, maxWidth: 460, marginBottom: 32 }}>
        Industry-grade curriculum taught by working professionals. Learn at your pace, earn your certification.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Btn onClick={() => onCourse(courses[0])} size="lg" style={{ background: C.accent }}>
          <Icon name="play-circle" size={18} color="#fff" /> Explore Courses
        </Btn>
      </div>
      <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {[['1,247', 'Students'], ['18', 'Video Lessons'], ['Certificate', 'On Completion']].map(([v, l]) => (
          <div key={l}><div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{v}</div><div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{l}</div></div>
        ))}
      </div>
    </div>

    {/* Course Grid */}
    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 24, color: C.text }}>Available Courses</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24 }}>
      {courses.map(course => (
        <div key={course.id} onClick={() => onCourse(course)} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,73,255,0.18)'; e.currentTarget.style.borderColor = `${C.accent}33`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border; }}>
          {/* Thumbnail */}
          <div style={{ height: 200, background: `linear-gradient(135deg,${C.bg},${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
              <Icon name="play" size={24} color="#ffffff" />
            </div>
            <div style={{ position: 'absolute', top: 14, left: 14 }}><Badge label="Best Seller" color="#f59e0b" /></div>
            <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 6 }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{course.totalLessons} lessons</span>
            </div>
          </div>
          {/* Info */}
          <div style={{ padding: '20px 20px 24px' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {course.tags?.map(t => <Badge key={t} label={t} />)}
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{course.title}</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, marginBottom: 16 }}>{course.description.slice(0, 90)}…</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13 }}>
              <Icon name="star" size={14} color="#f59e0b" />
              <strong>{course.rating}</strong>
              <span style={{ color: C.muted }}>·</span>
              <span style={{ color: C.muted }}>{course.students.toLocaleString()} students</span>
              <span style={{ color: C.muted }}>·</span>
              <span style={{ color: C.muted }}>{course.duration}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: `1px solid #1e1e1e` }}>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>${course.price}</span>
                <span style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'line-through', marginLeft: 8 }}>${course.originalPrice || course.price * 1.5}</span>
              </div>
              <Btn size="sm">Preview <Icon name="arrow" size={14} color="#fff" /></Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── PUBLIC COURSE DETAIL ───────────────────────────────────
const CourseDetail = ({ course, onEnroll, isLoggedIn }) => {
  const [activeLesson, setActiveLesson] = useState(null);
  const { progress, updateLessonProgress } = useProgress(course.id);

  const handlePassQuiz = (chId, score) => {
    updateLessonProgress(`quiz_${chId}`, 0, true);
  };

  const currentContent = activeLesson?.type === 'quiz' ? (
    <div style={{ padding: '40px 0' }}>
      <QuizPlayer 
        quiz={activeLesson.quizData} 
        passPercentage={course.passPercentage || 80}
        onPass={(s) => handlePassQuiz(activeLesson.chId, s)}
        onFail={() => {}} 
      />
    </div>
  ) : (
    <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
      <video src={activeLesson ? activeLesson.video : (course.trailer || '/trailer.mp4')} controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ background: `linear-gradient(135deg, ${C.text} 0%, #1e293b 100%)`, color: '#fff', padding: '60px 0 100px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {course.tags?.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t}</span>)}
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>{course.title}</h1>
            <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32, maxWidth: 600 }}>{course.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar user={{ name: course.instructor }} size={48} />
                <div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>Instructor</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{course.instructor}</div>
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>Rating</div>
                <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="star" size={14} color="#f59e0b" /> {course.rating} (0 students)
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Card style={{ padding: 40, background: '#fff', color: C.text, boxShadow: '0 30px 60px rgba(0,0,0,0.4)', transform: 'translateY(40px)' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>${course.price}</span>
                  <span style={{ color: C.muted, textDecoration: 'line-through' }}>${course.originalPrice}</span>
                </div>
                <div style={{ color: C.success, fontSize: 13, fontWeight: 700 }}>Exclusive Early Bird Offer</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Btn full size="lg" onClick={onEnroll}>Enroll Now — Lifetime Access</Btn>
                <div style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 12 }}>
                  30-Day Money-Back Guarantee
                </div>
              </div>
              <div style={{ marginTop: 32, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['play-circle', '12 professional lessons'],
                  ['award', 'Certificate of Completion'],
                  ['users', 'Exclusive Community Access'],
                  ['shield', 'LIFETIME ACCESS'],
                ].map(([i, t]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 500 }}>
                    <Icon name={i} size={16} color={C.accent} /> {t}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '80px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60 }}>
        <div>
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>About this course</h2>
            <div style={{ color: C.muted, fontSize: 16, lineHeight: 1.8 }}>
              {course.description}
            </div>
          </section>

          {isLoggedIn ? (
            <section>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Course Player</h2>
              {currentContent}
              <div style={{ marginTop: 24, padding: 24, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{activeLesson?.title || 'Course Preview'}</h3>
                <p style={{ fontSize: 14, color: C.muted }}>Select a lesson from the curriculum to start learning.</p>
              </div>
            </section>
          ) : (
            <section style={{ padding: 60, background: C.accentLight, borderRadius: 24, textAlign: 'center', border: `2px dashed ${C.accent}33` }}>
              <Icon name="lock" size={48} color={C.accent} />
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, margin: '20px 0 12px 0' }}>Enrolled Students Only</h2>
              <p style={{ color: C.muted, marginBottom: 32 }}>Sign in or enroll to access all professional lessons and certification quizzes.</p>
              <Btn onClick={onEnroll}>Get Started Now</Btn>
            </section>
          )}
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 40 }}>
            <Syllabus 
              course={course} 
              progress={progress} 
              onSelectLesson={(l) => setActiveLesson(l)} 
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

// ── AUTH PAGE ─────────────────────────────────────────────
const AuthPage = ({ onStudent, onAdmin, onBack }) => {
  const [tab, setTab] = useState('login');
  const [step, setStep] = useState(1); // signup steps: 1=email, 1.5=otp, 2=details, 3=photo
  const [lIdent, setLIdent] = useState(''); const [lPass, setLPass] = useState('');
  const [sEmail, setSEmail] = useState(''); const [sOTP, setSotp] = useState('');
  const [sFirst, setSFirst] = useState(''); const [sLast, setSLast] = useState('');
  const [sPass, setSPass] = useState(''); const [sPhoto, setSPhoto] = useState(null);
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const handleLogin = e => {
    e && e.preventDefault();
    if (!lIdent || !lPass) { setErr('Fill all fields.'); return; }
    setErr('');
    if (lIdent.trim() === ADMIN_CREDS.username && lPass === ADMIN_CREDS.password) {
      onAdmin({ name: 'Admin', role: 'admin', photo: null });
    } else {
      onStudent({ name: lIdent.includes('@') ? lIdent.split('@')[0] : lIdent, email: lIdent, role: 'student', photo: null });
    }
  };

  const sendOTP = e => {
    e.preventDefault();
    if (!sEmail.includes('@')) { setErr('Enter a valid email.'); return; }
    setErr(''); setStep(1.5);
  };

  const verifyOTP = e => {
    e.preventDefault();
    if (sOTP.length < 6) { setErr('Enter the full 6-digit OTP.'); return; }
    setErr(''); setStep(2);
  };

  const saveDetails = e => {
    e.preventDefault();
    if (!sFirst || !sPass) { setErr('Fill all required fields.'); return; }
    setErr(''); setStep(3);
  };

  const complete = () => {
    onStudent({ name: `${sFirst} ${sLast}`.trim(), email: sEmail, role: 'student', photo: sPhoto });
  };

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setSPhoto(ev.target.result);
    r.readAsDataURL(f);
  };

  const stepNum = step === 1 || step === 1.5 ? 1 : step;

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.surface} 0%, #ffffff 50%, ${C.accentLight} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Logo size="lg" />
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
            <Icon name="arrow-left" size={15} /> Back
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 6, marginBottom: 28, border: `1px solid ${C.border}` }}>
          {[['login', 'Log In'], ['signup', 'Sign Up']].map(([t, l]) => (
            <button key={t} onClick={() => { setTab(t); setErr(''); setStep(1); }}
              style={{ 
                flex: 1, padding: '12px', border: 'none', cursor: 'pointer', borderRadius: 8, fontSize: 14, fontWeight: 800, fontFamily: 'Inter, sans-serif', 
                background: tab === t ? '#fff' : 'transparent', 
                color: tab === t ? C.accent : C.muted, 
                boxShadow: tab === t ? '0 4px 12px rgba(0,0,0,0.08)' : 'none', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
              }}>{l.toUpperCase()}</button>
          ))}
        </div>

        <Card padding="32px">
          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Welcome back</h3>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 22 }}>Enter your credentials to continue</p>
              </div>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Email or Username" placeholder="you@gmail.com" value={lIdent} onChange={e => setLIdent(e.target.value)} icon="user" required />
                <Field label="Password" type="password" placeholder="Your password" value={lPass} onChange={e => setLPass(e.target.value)} icon="key" required />
                {err && <span style={{ color: C.danger, fontSize: 13 }}>{err}</span>}
                <Btn full size="lg" onClick={handleLogin}>Log In <Icon name="arrow" size={16} color="#fff" /></Btn>
              </form>
            </div>

          )}

          {/* ── SIGN UP ── */}
          {tab === 'signup' && (
            <div>
              {/* Step progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
                {[1, 2, 3].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 'none' : 0, gap: 6 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: stepNum >= s ? C.accent : C.border, color: stepNum >= s ? '#fff' : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, transition: 'all 0.2s', flexShrink: 0 }}>
                      {stepNum > s ? <Icon name="check" size={14} color="#fff" /> : s}
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 2, background: stepNum > s ? C.accent : C.border, borderRadius: 2, width: 60 }} />}
                  </div>
                ))}
                <span style={{ marginLeft: 8, fontSize: 13, color: C.muted, fontWeight: 500 }}>
                  {step <= 1.5 ? 'Verify Email' : step === 2 ? 'Your Details' : 'Profile Photo'}
                </span>
              </div>

              {/* Step 1: Email */}
              {step === 1 && (
                <form onSubmit={sendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Enter your Gmail</h3>
                  <Field label="Gmail Address" type="email" placeholder="yourname@gmail.com" value={sEmail} onChange={e => setSEmail(e.target.value)} icon="mail" required note="A verification OTP will be sent to this address" />
                  {err && <span style={{ color: C.danger, fontSize: 13 }}>{err}</span>}
                  <Btn full size="lg" onClick={sendOTP}>Send Verification OTP <Icon name="arrow" size={16} color="#fff" /></Btn>
                </form>
              )}

              {/* Step 1.5: OTP */}
              {step === 1.5 && (
                <form onSubmit={verifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Verify your email</h3>
                  <div style={{ padding: '12px 16px', background: C.accentLight, borderRadius: 8, fontSize: 13, color: C.accent, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="mail" size={15} color={C.accent} />
                    OTP sent to <strong>{sEmail}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#374151', marginBottom: 12, textAlign: 'center' }}>Enter 6-Digit OTP</div>
                    <OTPInput onChange={setSotp} />
                    <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: C.muted }}>
                      Didn't receive? <button type="button" onClick={sendOTP} style={{ color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Resend</button>
                    </div>
                  </div>
                  {err && <span style={{ color: C.danger, fontSize: 13 }}>{err}</span>}
                  <Btn full size="lg" onClick={verifyOTP}><Icon name="check-circle" size={16} color="#fff" /> Verify Email</Btn>
                  <Btn full variant="ghost" onClick={() => { setStep(1); setSotp(''); }}>← Change email</Btn>
                </form>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <form onSubmit={saveDetails} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Your details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="First Name" placeholder="Jane" value={sFirst} onChange={e => setSFirst(e.target.value)} required />
                <Field label="Last Name" placeholder="Smith" value={sLast} onChange={e => setSLast(e.target.value)} />
                  </div>
                  <Field label="Create Password" type="password" placeholder="Min. 8 characters" value={sPass} onChange={e => setSPass(e.target.value)} icon="key" required />
                  <Field label="Email (Verified)" value={sEmail} onChange={() => {}} readOnly note="Your verified email — cannot be changed" />
                  {err && <span style={{ color: C.danger, fontSize: 13 }}>{err}</span>}
                  <Btn full size="lg" onClick={saveDetails}>Save Details <Icon name="arrow" size={16} color="#fff" /></Btn>
                </form>
              )}

              {/* Step 3: Photo */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, alignSelf: 'flex-start' }}>Profile photo</h3>
                  <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>Add a photo so instructors recognize you. You can also do this later in Settings.</p>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <div onClick={() => fileRef.current.click()} style={{ width: 110, height: 110, borderRadius: '50%', cursor: 'pointer', border: `3px dashed ${sPhoto ? C.accent : C.muted}`, background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                    {sPhoto
                      ? <img src={sPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <><Icon name="camera" size={28} color="#d1d5db" /><span style={{ fontSize: 11, color: C.muted, marginTop: 6, fontFamily: 'Inter, sans-serif' }}>Upload Photo</span></>
                    }
                  </div>
                  {sPhoto && <Badge label="Photo selected ✓" color={C.success} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                    <Btn full size="lg" onClick={complete}><Icon name="check-circle" size={16} color="#fff" /> Complete Registration</Btn>
                    <Btn full variant="ghost" onClick={complete}>Skip — add photo later</Btn>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <p style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 20 }}>
          By continuing you agree to our <span style={{ color: C.accent, cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: C.accent, cursor: 'pointer' }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

// ── PHONE OTP MODAL ───────────────────────────────────────
const PhoneOTPModal = ({ open, onClose, onVerified }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');

  const send = () => {
    if (phone.replace(/\D/g, '').length < 10) { setErr('Enter a valid phone number.'); return; }
    setErr(''); setStep('otp');
  };
  const verify = () => {
    if (otp.length < 6) { setErr('Enter the full 6-digit OTP.'); return; }
    setErr(''); onVerified();
  };

  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Verify Phone Number — Required for Payment" width={440}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {step === 'phone' ? (
          <>
            <div style={{ padding: '12px 16px', background: '#1a1000', border: '1px solid #f59e0b44', borderRadius: 8, fontSize: 13, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="info" size={16} color="#f59e0b" /> Phone verification is required before payment can be processed.
            </div>
            <div style={{ padding: '10px 14px', background: '#0d1a0d', border: '1px solid #16a34a44', borderRadius: 8, fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="info" size={14} color="#22c55e" /><span><strong>Dev mode:</strong> Enter any number, then any 6-digit OTP (e.g. <code style={{fontFamily:'monospace', background:'#1a2a1a', padding:'1px 5px', borderRadius:3}}>123456</code>) to test.</span>
            </div>
            <Field label="Mobile Number" type="tel" placeholder="+91 00000 00000" value={phone} onChange={e => setPhone(e.target.value)} icon="phone" required note="An OTP will be sent to verify your number" />
            {err && <span style={{ color: C.danger, fontSize: 13 }}>{err}</span>}
            <Btn full size="lg" onClick={send}>Send OTP to Phone <Icon name="arrow" size={16} color="#fff" /></Btn>
          </>
        ) : (
          <>
            <div style={{ padding: '12px 16px', background: C.accentLight, border: `1px solid ${C.accent}33`, borderRadius: 8, fontSize: 13, color: C.accent, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="phone" size={15} color={C.accent} /> OTP sent to <strong>{phone}</strong>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', marginBottom: 12, textAlign: 'center' }}>Enter 6-Digit OTP</div>
              <OTPInput onChange={setOtp} />
            </div>
            {err && <span style={{ color: C.danger, fontSize: 13, textAlign: 'center' }}>{err}</span>}
            <Btn full size="lg" onClick={verify}><Icon name="check-circle" size={16} color="#fff" /> Verify & Proceed to Payment</Btn>
            <Btn full variant="ghost" onClick={() => { setStep('phone'); setOtp(''); }}>← Change number</Btn>
          </>
        )}
      </div>
    </Modal>
  );
};

// ── STUDENT SETTINGS ──────────────────────────────────────
const StudentSettings = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name || '');
  const [photo, setPhoto] = useState(user.photo || null);
  const [toast, setToast] = useState(false);
  const fileRef = useRef(null);

  const save = () => {
    onUpdate({ ...user, name, photo });
    setToast(true); setTimeout(() => setToast(false), 2500);
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader(); r.onload = ev => setPhoto(ev.target.result); r.readAsDataURL(f);
  };

  return (
    <div style={{ maxWidth: 620, margin: '48px auto', padding: '0 32px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 8, color: C.text }}>My Profile</h1>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Manage your account details and profile picture.</p>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <div style={{ position: 'relative' }}>
            <Avatar user={{ ...user, photo, name }} size={80} />
            <button onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: C.accent, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="camera" size={13} color="#fff" />
            </button>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{name}</div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>{user.email}</div>
            <button onClick={() => fileRef.current.click()} style={{ color: C.accent, fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginTop: 6 }}>Change photo</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} icon="user" required />
          <Field label="Email Address" value={user.email || ''} onChange={() => {}} readOnly note="Cannot be changed after signup" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
            <Btn variant="secondary" onClick={() => { setName(user.name); setPhoto(user.photo); }}>Discard</Btn>
            <Btn onClick={save}><Icon name="check" size={15} color="#fff" /> Save Changes</Btn>
          </div>
        </div>
      </Card>
      <Toast message="Profile updated!" visible={toast} />
    </div>
  );
};

// ── ADMIN DASHBOARD ───────────────────────────────────────
const AdminSidebar = ({ page, setPage }) => {
  const nav = [
    { id: 'courses', label: 'Courses', icon: 'book' },
    { id: 'content', label: 'Content', icon: 'upload' },
    { id: 'students', label: 'Students', icon: 'users' },
    { id: 'analytics', label: 'Analytics', icon: 'chart' },
    { id: 'payments', label: 'Payments', icon: 'credit' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <aside style={{ width: 230, background: '#fff', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, overflowY: 'auto' }}>
      <div style={{ padding: '8px 12px', marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        <Logo size="sm" />
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.success }} />
          <span style={{ fontSize: 11, color: C.success, fontWeight: 700 }}>Admin Panel</span>
        </div>
      </div>
      {nav.map(item => (
        <button key={item.id} onClick={() => setPage(item.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: page === item.id ? 700 : 500, background: page === item.id ? C.accentLight : 'transparent', color: page === item.id ? C.accent : C.muted, textAlign: 'left', transition: 'all 0.1s' }}
          onMouseEnter={e => { if (page !== item.id) { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.text; } }}
          onMouseLeave={e => { if (page !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; } }}>
          <Icon name={item.icon} size={16} color={page === item.id ? C.accent : C.muted} />
          {item.label}
        </button>
      ))}
    </aside>
  );
};

const THead = ({ cols }) => (
  <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '11px 20px', background: '#ffffff', borderBottom: `1px solid ${C.border}` }}>
    {Object.keys(cols).map ? null : null}
  </div>
);

const AdminCourses = ({ courses, onSaveCourse }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [form, setForm] = useState({ 
    title: '', instructor: '', price: '', originalPrice: '', trailer: '', thumbnail: '', 
    passPercentage: 80, description: '', tags: [], rating: 4.9, students: 0, duration: '3h 0m',
    chapters: [{ id: Date.now(), title: '', lessons: [], quiz: [] }] 
  });
  const [toast, setToast] = useState(false);

  const handleEdit = (c) => {
    setEditingCourseId(c.id);
    setForm({
      id: c.id,
      title: c.title,
      instructor: c.instructor,
      price: c.price,
      originalPrice: c.originalPrice || c.price * 1.5,
      trailer: c.trailer,
      thumbnail: c.thumbnail,
      passPercentage: c.passPercentage,
      description: c.description,
      tags: c.tags,
      rating: c.rating || 4.9,
      students: c.students || 0,
      duration: c.duration || '3h 0m',
      chapters: c.chapters.length > 0 ? c.chapters : [{ id: Date.now(), title: '', lessons: [], quiz: [] }]
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingCourseId(null);
    setForm({ 
      title: '', instructor: '', price: '', originalPrice: '', trailer: '', thumbnail: '', 
      passPercentage: 80, description: '', tags: [], rating: 4.9, students: 0, duration: '3h 0m',
      chapters: [{ id: Date.now(), title: '', lessons: [], quiz: [] }] 
    });
    setShowForm(true);
  };
  const set = k => e => {
    const val = k === 'tags' ? e.target.value.split(',').map(t => t.trim()) : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
  };

  
  const addChapter = () => setForm(f => ({ ...f, chapters: [...f.chapters, { id: Date.now(), title: '', lessons: [], quiz: [] }] }));
  const updateChapter = (id, val) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === id ? { ...c, title: val } : c) }));
  
  const addLesson = (chId) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, lessons: [...c.lessons, { id: Date.now(), title: '', video: '' }] } : c) }));
  const updateLesson = (chId, lesId, field, val) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, lessons: c.lessons.map(l => l.id === lesId ? { ...l, [field]: val } : l) } : c) }));
  
  const addQuiz = (chId) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, quiz: [...c.quiz, { id: Date.now(), question: '', options: ['', '', '', ''], correct: 0 }] } : c) }));
  const updateQuiz = (chId, qId, field, val, optIdx) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, quiz: c.quiz.map(q => {
    if (q.id === qId) {
      if (optIdx !== undefined) {
        const newOpts = [...q.options]; newOpts[optIdx] = val; return { ...q, options: newOpts };
      }
      return { ...q, [field]: val };
    }
    return q;
  }) } : c) }));

  const save = () => { 
    const courseData = {
      ...form,
      id: editingCourseId || Date.now(),
      totalLessons: form.chapters.reduce((acc, c) => acc + c.lessons.length, 0),
    };

    onSaveCourse(courseData);
    setToast(true); 
    setShowForm(false); 
    setTimeout(() => setToast(false), 2500); 
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800 }}>Course Management</h1>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Create and manage courses, modules, and lessons.</p>
        </div>
        <Btn onClick={handleNew}><Icon name="plus" size={15} color="#fff" /> New Course</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 28, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: C.accent }}>{editingCourseId ? 'Edit Course' : 'Build Your Course'}</h3>
            <Btn variant="ghost" onClick={() => setShowForm(false)}><Icon name="x" size={16} /></Btn>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section>
              <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: 16 }}>Basic Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Course Title" placeholder="e.g. Advanced Lighting" required value={form.title} onChange={set('title')} />
                <Field label="Instructor Name" placeholder="e.g. Admin" required value={form.instructor} onChange={set('instructor')} />
                <Field label="Price (USD)" type="number" placeholder="199" value={form.price} onChange={set('price')} />
                <Field label="Original Price (Display Only)" type="number" placeholder="299" value={form.originalPrice} onChange={set('originalPrice')} />
                <Field label="Pass Percentage (%)" type="number" placeholder="80" value={form.passPercentage} onChange={set('passPercentage')} />
                <Field label="Duration (e.g. 3h 15m)" placeholder="3h 0m" value={form.duration} onChange={set('duration')} />
                <Field label="Simulated Rating (1-5)" type="number" step="0.1" placeholder="4.9" value={form.rating} onChange={set('rating')} />
                <Field label="Students Enrolled" type="number" placeholder="1247" value={form.students} onChange={set('students')} />
                <Field label="Tags (Comma separated)" placeholder="Architecture, Design, Pro" value={form.tags.join(', ')} onChange={set('tags')} />

              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.muted }}>Course Thumbnail (Image)</label>
                  <input type="file" accept="image/*" style={{ fontSize: 13, color: C.muted, border: `1.5px solid ${C.border}`, padding: 8, borderRadius: 8 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.muted }}>Trailer Video (MP4)</label>
                  <input type="file" accept="video/mp4" style={{ fontSize: 13, color: C.muted, border: `1.5px solid ${C.border}`, padding: 8, borderRadius: 8 }} />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: 6 }}>Description</div>
                <textarea rows={3} placeholder="Short course description..." value={form.description} onChange={set('description')}
                  style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted }}>Curriculum Builder</h4>
                <Btn variant="secondary" size="sm" onClick={addChapter}><Icon name="plus" size={14} /> Add Chapter</Btn>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {form.chapters.map((ch, chIdx) => (
                  <Card key={ch.id} style={{ background: C.surface, borderStyle: 'dashed' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Field label={`Chapter ${chIdx + 1} Title`} placeholder="Introduction to Light" value={ch.title} onChange={e => updateChapter(ch.id, e.target.value)} />
                    </div>
                    
                    <div style={{ marginLeft: 20, borderLeft: `2px solid ${C.border}`, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>LESSONS</div>
                          <Btn variant="ghost" size="sm" onClick={() => addLesson(ch.id)} style={{ color: C.accent }}>+ Add Lesson</Btn>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {ch.lessons.map((l, lIdx) => (
                            <div key={l.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ fontSize: 12, color: C.muted }}>{lIdx+1}.</span>
                              <input placeholder="Lesson Title" value={l.title} onChange={e => updateLesson(ch.id, l.id, 'title', e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, outline: 'none' }} />
                              <input type="file" accept="video/mp4" style={{ fontSize: 11, width: 180 }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>CHAPTER QUIZ (MCQ)</div>
                          <Btn variant="ghost" size="sm" onClick={() => addQuiz(ch.id)} style={{ color: C.accent }}>+ Add Question</Btn>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {ch.quiz.map((q, qIdx) => (
                            <div key={q.id} style={{ background: '#fff', padding: 16, borderRadius: 10, border: `1px solid ${C.border}` }}>
                              <div style={{ marginBottom: 10, display: 'flex', gap: 8 }}>
                                <span style={{ fontWeight: 700, fontSize: 13, color: C.accent }}>Q{qIdx+1}.</span>
                                <input placeholder="Enter the MCQ question..." value={q.question} onChange={e => updateQuiz(ch.id, q.id, 'question', e.target.value)}
                                  style={{ flex: 1, border: 'none', borderBottom: `1px solid ${C.border}`, padding: '4px 0', fontSize: 14, outline: 'none' }} />
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input type="radio" checked={q.correct === oIdx} onChange={() => updateQuiz(ch.id, q.id, 'correct', oIdx)} />
                                    <input placeholder={`Option ${oIdx+1}`} value={opt} onChange={e => updateQuiz(ch.id, q.id, 'option', e.target.value, oIdx)}
                                      style={{ width: '100%', padding: '6px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, outline: 'none' }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.border}`, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setShowForm(false)}>Discard</Btn>
            <Btn onClick={save}><Icon name="check" size={15} color="#fff" /> Save & Publish Course</Btn>
          </div>
        </Card>
      )}

      {!showForm && (
        <Card padding="0" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 130px', padding: '12px 20px', background: '#111', borderBottom: `1px solid ${C.border}` }}>
            {['Title', 'Students', 'Revenue', 'Status', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted }}>{h}</span>
            ))}
          </div>
          {courses.map(c => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 130px', padding: '16px 20px', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>By {c.instructor} · ${c.price}</div>
              </div>
              <span style={{ fontWeight: 600 }}>{c.students.toLocaleString()}</span>
              <span style={{ fontWeight: 700, color: C.success }}>${(c.students * c.price).toLocaleString()}</span>
              <div style={{ display: 'flex' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', marginRight: 8 }} />
                  Published
                </span>
              </div>
              <Btn size="sm" variant="secondary" onClick={() => handleEdit(c)} style={{ color: C.text }}><Icon name="edit" size={13} /> Edit</Btn>
            </div>
          ))}
          <div style={{ padding: '16px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>Click "New Course" to add more.</div>
        </Card>
      )}

      <Toast message="Course saved!" visible={toast} />
    </div>
  );
};

const AdminPayments = () => {
  const [rzk, setRzk] = useState(''); const [rzs, setRzs] = useState('');
  const [stk, setStk] = useState(''); const [sts, setSts] = useState('');
  const [toast, setToast] = useState('');
  const save = n => { setToast(n + ' connected!'); setTimeout(() => setToast(''), 2500); };

  return (
    <div>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Payment Configuration</h1>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Connect payment gateways to begin accepting course enrollments.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[
          { name: 'Razorpay', color: '#3395ff', sub: 'Best for India — UPI, NetBanking', keys: [['Key ID', rzk, setRzk, 'rzp_live_...'], ['Key Secret', rzs, setRzs, 'Secret key']] },
          { name: 'Stripe', color: '#635bff', sub: 'Best for global payments', keys: [['Publishable Key', stk, setStk, 'pk_live_...'], ['Secret Key', sts, setSts, 'sk_live_...']] },
        ].map(gw => (
          <Card key={gw.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: gw.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="credit" size={22} color={gw.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{gw.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{gw.sub}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}><Badge label={gw.keys[0][1] ? 'Connected' : 'Not Set'} color={gw.keys[0][1] ? C.success : C.danger} /></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {gw.keys.map(([l, v, s, ph]) => (
                <Field key={l} label={l} type="password" placeholder={ph} value={v} onChange={e => s(e.target.value)} icon="key" />
              ))}
              <Btn full onClick={() => save(gw.name)} style={{ background: gw.color }}>Connect {gw.name}</Btn>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 16, color: C.text }}>Recent Transactions</h3>
        <div style={{ height: 120, background: '#111', border: `1.5px dashed ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <Icon name="credit" size={28} color="#e5e7eb" />
          <span style={{ color: C.muted, fontSize: 13 }}>Transactions appear here once gateways are active</span>
        </div>
      </Card>
      <Toast message={toast} visible={!!toast} />
    </div>
  );
};

const AdminStudents = () => (
  <div>
    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8, color: C.text }}>Students</h1>
    <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>View and manage all enrolled students.</p>
    <Card padding="0" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '12px 20px', background: '#111', borderBottom: `1px solid ${C.border}` }}>
        {['Student', 'Email', 'Enrolled', 'Status'].map(h => (
          <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>{h}</span>
        ))}
      </div>
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <Icon name="users" size={36} color="#e5e7eb" />
        <div style={{ marginTop: 12, fontSize: 14, color: '#9ca3af' }}>No students enrolled yet</div>
      </div>
    </Card>
  </div>
);

const AdminAnalytics = () => (
  <div>
    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8, color: C.text }}>Analytics</h1>
    <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Track performance, revenue, and engagement.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 24 }}>
      {[
        { label: 'Total Students', value: '1,247', note: 'Active learners', color: C.accent },
        { label: 'Total Revenue', value: '$0.00', note: 'Configure payment gateway', color: C.success },
        { label: 'Completion Rate', value: '—', note: 'Data pending', color: C.warning },
      ].map(s => (
        <Card key={s.label}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: 10 }}>{s.label}</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{s.note}</div>
        </Card>
      ))}
    </div>
    <Card>
      <div style={{ height: 200, background: '#ffffff', border: `1.5px dashed ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: C.muted, fontSize: 13 }}>Chart — connects to backend</span>
      </div>
    </Card>
  </div>
);

const AdminContent = () => (
  <div>
    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8, color: C.text }}>Content Manager</h1>
    <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Upload and manage videos, PDFs, and course materials.</p>
    <Card>
      <div style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: '48px 24px', textAlign: 'center', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.accent} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
        <Icon name="upload" size={36} color="#d1d5db" />
        <div style={{ marginTop: 12, fontWeight: 700, fontSize: 15 }}>Drag & drop files here</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>MP4, PDF, ZIP up to 2GB</div>
        <Btn variant="secondary" style={{ marginTop: 16 }}><Icon name="upload" size={14} /> Browse Files</Btn>
      </div>
    </Card>
    <Card style={{ marginTop: 20 }}>
      <div style={{ color: C.muted, textAlign: 'center', padding: 32, fontSize: 14 }}>No assets uploaded yet</div>
    </Card>
  </div>
);

const AdminSettingsPage = ({ onLogout }) => (
  <div>
    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8, color: C.text }}>Platform Settings</h1>
    <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Global configuration for Literight Academy.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>General Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Academy Name" placeholder="Literight Academy" />
          <Field label="Support Email" placeholder="hello@literight.com" />
          <Field label="Platform URL" placeholder="https://literight.academy" />
          <Field label="Default Currency" placeholder="USD" />
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <Btn><Icon name="check" size={15} color="#fff" /> Save</Btn>
        </div>
      </Card>
      <Card>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Admin Account</h3>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>Logged in as <strong>Admin</strong>. Credentials managed in backend config.</p>
        <Btn variant="danger" onClick={onLogout}><Icon name="logout" size={15} color="#fff" /> Log Out</Btn>
      </Card>
    </div>
  </div>
);

const AdminDashboard = ({ user, onLogout, courses, onSaveCourse }) => {
  const [page, setPage] = useState('courses');
  const pages = {
    courses: <AdminCourses courses={courses} onSaveCourse={onSaveCourse} />,
    content: <AdminContent />,
    students: <AdminStudents />,
    analytics: <AdminAnalytics />,
    payments: <AdminPayments />,
    settings: <AdminSettingsPage onLogout={onLogout} />,
  };
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar page={page} setPage={setPage} />
      <main style={{ marginLeft: 230, flex: 1, padding: '36px 40px', background: C.bg, minHeight: '100vh' }}>
        {pages[page]}
      </main>
    </div>
  );
};

// ── ROOT APP ──────────────────────────────────────────────
export default function App() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [screen, setScreen] = useState('public');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [phoneModal, setPhoneModal] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });

  // Fetch courses from persistent backend
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setCourses(data);
        else setCourses(COURSES); // Fallback to template
      })
      .catch(() => setCourses(COURSES));
  }, []);

  const activeCourse = courses.find(c => c.id === selectedCourseId);

  const handleSaveCourse = (updatedCourse) => {
    // Optimistic Update
    setCourses(prev => {
      const exists = prev.find(c => c.id === updatedCourse.id);
      if (exists) return prev.map(c => c.id === updatedCourse.id ? updatedCourse : c);
      return [...prev, updatedCourse];
    });

    // Persistent Sync
    fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourse)
    })
    .then(() => showToast(updatedCourse.id ? 'Course updated & synced! ☁️' : 'Course created & synced! ☁️'))
    .catch(() => showToast('Saved locally, sync failed.', 'warning'));
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  const handleStudent = userData => {
    setUser(userData); setRole('student'); setScreen('public');
    showToast(`Welcome, ${userData.name}! 🎉`);
  };

  const handleAdmin = adminData => {
    setUser(adminData); setRole('admin'); setScreen('admin');
  };

  const handleLogout = () => {
    setUser(null); setRole(null); setScreen('public');
    showToast('Logged out.', 'info');
  };

  const handleEnroll = () => {
    if (!user) { setScreen('auth'); return; }
    setPhoneModal(true);
  };

  const handlePhoneVerified = () => {
    setPhoneModal(false);
    showToast('Phone verified! Enrollment successful. 🎓');
  };

  if (role === 'admin') return <AdminDashboard user={user} onLogout={handleLogout} courses={courses} onSaveCourse={handleSaveCourse} />;

  if (screen === 'auth') {
    return (
      <AuthPage
        onStudent={handleStudent}
        onAdmin={handleAdmin}
        onBack={() => setScreen(activeCourse ? 'course' : 'public')}

      />
    );
  }

  if (screen === 'settings') {
    return (
      <>
        <PublicNav user={user} onLoginClick={() => setScreen('auth')} onLogout={handleLogout} role={role} setScreen={setScreen} />
        <StudentSettings user={user} onUpdate={u => { setUser(u); showToast('Profile updated!'); }} />
        <Toast message={toast.msg} type={toast.type} visible={toast.visible} />
      </>
    );
  }

  return (
    <>
      <PublicNav user={user} onLoginClick={() => setScreen('auth')} onLogout={handleLogout} role={role} setScreen={s => { setScreen(s); }} />
      {screen === 'course' && activeCourse
        ? <CourseDetail course={activeCourse} onEnroll={handleEnroll} isLoggedIn={!!user} />
        : <PublicLanding courses={courses} onCourse={c => { setSelectedCourseId(c.id); setScreen('course'); }} />
      }
      <PhoneOTPModal open={phoneModal} onClose={() => setPhoneModal(false)} onVerified={handlePhoneVerified} />
      <Toast message={toast.msg} type={toast.type} visible={toast.visible} />
    </>
  );
}
