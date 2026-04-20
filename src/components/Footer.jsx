import React from 'react';
import { C, Logo } from './Common';
import Icon from './Icon';

const SOCIAL_LINKS = [
  { name: 'instagram', url: 'https://www.instagram.com/lite.lab/' },
  { name: 'pinterest', url: 'https://in.pinterest.com/litelabindia/_created/' },
  { name: 'linkedin', url: 'https://www.linkedin.com/in/litelab-india-b78729277/' },
  { name: 'facebook', url: 'https://www.facebook.com/litelab.india/' },
  { name: 'x-social', url: 'https://x.com/litelab_india' },
  { name: 'youtube', url: 'https://www.youtube.com/@litelab4250' }
];

const Footer = () => {
  return (
    <footer style={{ background: '#000', color: '#fff', padding: '120px 32px 60px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 80, marginBottom: 100 }}>
          
          {/* Brand Signature */}
          <div>
            <div style={{ marginBottom: 40 }}>
              <Logo size="lg" stacked />
            </div>
            <p style={{ color: '#444', fontSize: 13, lineHeight: 1.8, marginBottom: 40, letterSpacing: '0.02em', maxWidth: 300 }}>
              LITERIGHT ACADEMY IS THE GLOBAL VANGUARD OF PROFESSIONAL LIGHTING EDUCATION. WE ARCHITECT THE FUTURE OF LIGHT THROUGH RIGOROUS TECHNICAL MASTERY.
            </p>
            {/* Real Social Links with Architectural Icons */}
            <div style={{ display: 'flex', gap: 24 }}>
              {SOCIAL_LINKS.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" 
                  style={{ color: '#fff', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', opacity: 0.8 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}>
                  <Icon name={s.name} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Academy Nexus */}
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 40, color: '#222' }}>Academy</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {['CURRICULUM', 'CERTIFICATION', 'STUDENT PROFILE', 'SUPPORT'].map(l => (
                <li key={l} style={{ color: '#444', fontSize: 10, fontWeight: 900, cursor: 'pointer', transition: '0.3s', letterSpacing: '0.2em' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Intel */}
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 40, color: '#222' }}>Intel</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {['CONSULTANCY', 'SOLUTIONS', 'GLOBAL PROJECTS', 'CAREERS'].map(l => (
                <li key={l} style={{ color: '#444', fontSize: 10, fontWeight: 900, cursor: 'pointer', transition: '0.3s', letterSpacing: '0.2em' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Global Inquiries */}
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 40, color: '#222' }}>Inquiries</h4>
            <div style={{ color: '#444', fontSize: 10, fontWeight: 800, lineHeight: 2.2, letterSpacing: '0.1em' }}>
              <p>MILANO HQ: VIA DELLA LUCE 42, ITALY</p>
              <p>CONTACT@LITELAB.COM</p>
              <p style={{ color: '#999', marginTop: 24 }}>GLOBAL SUPPORT ACTIVE</p>
              <p>09:00 — 18:00 CET</p>
            </div>
          </div>

        </div>

        {/* Legal Horizon */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <p style={{ fontSize: 9, color: '#222', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} LITELAB MILANO. ARCHITECTED BY LBRD. ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: 'flex', gap: 40 }}>
            {['PRIVACY', 'TERMS', 'COOKIES'].map(l => (
              <span key={l} style={{ fontSize: 9, color: '#222', fontWeight: 900, letterSpacing: '0.2em', cursor: 'pointer', transition: '0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#666'}
                onMouseLeave={e => e.currentTarget.style.color = '#222'}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
