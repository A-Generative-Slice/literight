import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, Avatar, Card } from '../components/Common';
import { Btn, Input } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProfilePage = () => {
  const { user, token, setUser, courses } = useLmsStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [dp, setDp] = useState(user?.dp || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${ENDPOINT}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, dp })
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setUser(data.user); // updates global store with the new user object
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ height: 160, background: `linear-gradient(135deg, ${C.text}, ${C.bg})` }} />
      
      <div style={{ maxWidth: 1000, margin: '-60px auto 40px', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Sidebar */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <Card style={{ padding: 24, textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Avatar user={user} size={80} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: C.text }}>{user.name || 'Student'}</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>{user.username}</p>
              
              <div style={{ display: 'inline-block', background: user.isPremium ? 'rgba(245, 158, 11, 0.1)' : C.surface, color: user.isPremium ? '#f59e0b' : C.muted, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                {user.isPremium ? '★ Premium Member' : 'Free Tier'}
              </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TabBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="user" label="Edit Profile" />
              <TabBtn active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon="book" label="My Courses" />
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <Card style={{ padding: 40, minHeight: 400 }}>
              {activeTab === 'profile' && (
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32, fontFamily: 'Outfit, sans-serif' }}>Profile Settings</h2>
                  
                  {message && (
                    <div style={{ padding: 12, borderRadius: 8, marginBottom: 24, background: message.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? '#16a34a' : '#ef4444', fontSize: 14, fontWeight: 500 }}>
                      {message}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
                    <Input 
                      label="Full Name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Jane Doe" 
                    />
                    
                    <Input 
                      label="Profile Picture URL" 
                      value={dp} 
                      onChange={e => setDp(e.target.value)} 
                      placeholder="https://example.com/avatar.jpg" 
                    />

                    <div style={{ marginTop: 16 }}>
                      <Btn onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Btn>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && (
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32, fontFamily: 'Outfit, sans-serif' }}>My Courses</h2>
                  {courses && courses.map(course => (
                    <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} style={{ display: 'flex', gap: 20, padding: 20, border: `1px solid ${C.border}`, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = C.accent} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <div style={{ width: 160, height: 100, borderRadius: 10, background: course.thumbnail ? `url(${course.thumbnail}) center/cover no-repeat` : C.surface }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{course.title}</h3>
                         <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
                           Access: <strong>{user.isPremium ? 'Full Premium Access' : 'Module 1 Preview Only'}</strong>
                         </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                         <Icon name="chevron-right" color={C.muted} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', width: '100%', background: active ? C.surface : 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: active ? 700 : 500, color: active ? C.text : C.muted, textAlign: 'left', transition: 'all 0.2s' }}>
    <Icon name={icon} size={18} color={active ? C.accent : C.muted} />
    {label}
  </button>
);

export default ProfilePage;
