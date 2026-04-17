import React from 'react';
import { C, Logo } from './Common';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#f8fafc', padding: '100px 32px 60px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 60, marginBottom: 80 }}>
          
          {/* Brand Section */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ marginBottom: 28, filter: 'brightness(0) invert(1)' }}>
              <Logo size="lg" />
            </div>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              Litelab LiteRight Academy is the global reference for professional architectural lighting education, bridging the gap between theory and industry excellence.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['instagram', 'linkedin', 'twitter', 'youtube'].map(s => (
                <div key={s} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.accent}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <Icon name={s} size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Academy Links */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32, color: C.accent }}>Academy</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {['Curriculum', 'Certification', 'Direct Career Path', 'Student Support'].map(l => (
                <li key={l} style={{ color: '#94a3b8', fontSize: 15, cursor: 'pointer', transition: '0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Links */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32, color: '#fff' }}>Corporate</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {['Litelab Consultancy', 'Bespoke Solutions', 'Global Projects', 'Career Opportunities'].map(l => (
                <li key={l} style={{ color: '#94a3b8', fontSize: 15, cursor: 'pointer', transition: '0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32, color: '#fff' }}>Inquiries</h4>
            <div style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 12 }}>Milano HQ: Via della Luce 42, Italy</p>
              <p style={{ marginBottom: 12 }}>contact@litelab.com</p>
              <p style={{ fontWeight: 700, color: '#fff', marginTop: 20 }}>Global Support Available</p>
              <p>Mon - Fri: 9:00 AM - 6:00 PM CET</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="md-flex-col md-gap-4 md-text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <p style={{ fontSize: 13, color: '#475569' }}>
            © {new Date().getFullYear()} Litelab Milano. All rights reserved. LiteRight Academy is a registered trademark.
          </p>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(l => (
              <span key={l} style={{ fontSize: 13, color: '#475569', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
