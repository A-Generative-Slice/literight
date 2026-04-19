import React from 'react';
import { Badge, Card } from '../components/Common';
import Icon from '../components/Icon';

const CATEGORIES = [
  { name: 'ART & CULTURE', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop' },
  { name: 'BUILDERS', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop' },
  { name: 'FACADE', img: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&auto=format&fit=crop' },
  { name: 'HOSPITALITY', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop' },
  { name: 'INFRASTRUCTURE', img: 'https://images.unsplash.com/photo-1471018197924-c10a3000632a?q=80&w=400&auto=format&fit=crop' },
  { name: 'LANDSCAPE', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop' },
  { name: 'RESIDENTIAL', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop' },
  { name: 'RETAIL', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
];

const PublicLanding = ({ courses, onCourse }) => {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', paddingTop: 100 }}>
      {/* 8-Circle Category Navigator */}
      <section style={{ padding: '40px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 40,
          padding: '0 var(--container-px)'
        }}>
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="reveal circle-nav-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="circle-img">
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="circle-label">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)' }}>
          <h2 style={{ fontSize: 40, marginBottom: 60, textAlign: 'center' }}>Available Masterclasses</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 40 }}>
            {(courses || []).map((c, i) => (
              <Card 
                key={i} 
                onClick={() => onCourse(c)}
                padding="0"
                style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div style={{ position: 'relative', paddingTop: '60%', width: '100%' }}>
                  <img src={c.thumbnail} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 12 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 1.6 }}>{c.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>{c.instructor}</span>
                    <Icon name="arrow" size={14} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Footer (Minimalist) */}
      <footer style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 40, fontSize: 14, fontWeight: 800, letterSpacing: '0.1em' }}>
          <span>HOME</span>
          <span>ABOUT</span>
          <span>PROJECTS</span>
          <span>TEAM</span>
          <span>CONTACT</span>
        </div>
        <div style={{ fontSize: 11, color: '#444', letterSpacing: '0.05em' }}>
          COPYRIGHT © 2026. ALL RIGHTS RESERVED. DESIGNED AND DEVELOPED BY LITELAB
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
