import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, Avatar, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProfilePage = () => {
  const { user, courses, updateProfile, uploadFile } = useLmsStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = React.useRef(null);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await updateProfile(name, user.dp);
    if (res.success) setMessage('Profile updated successfully!');
    else setMessage(res.error || 'Error saving profile');
    setSaving(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    setMessage('Uploading image...');
    const res = await uploadFile(file);
    if (res.success) {
      const updateRes = await updateProfile(name, res.url);
      if (updateRes.success) setMessage('Profile picture updated!');
      else setMessage('Picture uploaded but profile update failed.');
    } else setMessage('Failed to upload image.');
    setSaving(false);
  };

  const enrolledCourses = courses.filter(c => user.enrolledCourseIds?.includes(c.id));

  return (
    <div className="reveal" style={{ background: C.bg, minHeight: 'calc(100vh - 72px)', paddingBottom: 100 }}>
      {/* Header Banner - High Impact */}
      <div style={{ height: 240, background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'radial-gradient(circle at 70% 30%, #BE123C 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1470") center/cover no-repeat' }} />
      </div>
      
      <div 
        className="md-grid-reset" 
        style={{ maxWidth: 1200, margin: '-80px auto 0', padding: '0 var(--container-px)', display: 'grid', gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)', gap: 'clamp(24px, 4vw, 40px)', alignItems: 'start' }}
      >
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          <Card glass padding="32px" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 20px' }}>
              <Avatar user={user} size={100} />
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 10, background: C.accent, border: '3px solid #fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: C.shadow }}>
                <Icon name="camera" size={14} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 4 }}>{user.name || user.username.split('@')[0]}</h2>
            <p style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{user.username}</p>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', gap: 20 }}>
               <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>{enrolledCourses.length}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Courses</div>
               </div>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TabBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="user" label="Personal Identity" />
            <TabBtn active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon="book-open" label="Learning Path" />
          </div>
        </div>

        {/* Main Content Area */}
        <Card style={{ padding: 'clamp(24px, 5vw, 48px)', minHeight: 600 }} className="md-p-6">
          {activeTab === 'profile' && (
            <div>
              <div style={{ marginBottom: 40 }}>
                <Badge label="Account Settings" />
                <h2 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginTop: 12 }}>Personal Identity</h2>
                <p style={{ color: C.muted, marginTop: 8, fontWeight: 500 }}>Manage how you appear across the LiteRight Academy platform.</p>
              </div>
              
              {message && (
                <div className="reveal" style={{ padding: '16px 20px', borderRadius: 16, marginBottom: 32, background: message.includes('success') || message.includes('updated') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') || message.includes('updated') ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${message.includes('success') || message.includes('updated') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                  <Icon name={message.includes('success') || message.includes('updated') ? "check-circle" : "alert-circle"} size={18} />
                  {message}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 500 }}>
                <Field label="Display Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Leonardo da Vinci" icon="user" />
                <Field label="Email Address" value={user.username} readOnly icon="mail" note="Your email cannot be changed for security reasons." />
                
                <div style={{ marginTop: 20, display: 'flex', gap: 16 }}>
                  <Btn onClick={handleSave} disabled={saving} size="lg" style={{ borderRadius: 16 }}>
                    {saving ? 'Syncing...' : 'Save Identity'}
                  </Btn>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div style={{ marginBottom: 40 }}>
                <Badge label="Enrollments" />
                <h2 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginTop: 12 }}>Learning Path</h2>
                <p style={{ color: C.muted, marginTop: 8, fontWeight: 500 }}>Your active specializations and certifications.</p>
              </div>

              {enrolledCourses.length > 0 ? (
                <div style={{ display: 'grid', gap: 20 }}>
                  {enrolledCourses.map(course => (
                    <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="hover-lift" style={{ display: 'flex', gap: 24, padding: 24, border: `1px solid ${C.border}`, borderRadius: 24, cursor: 'pointer', background: '#fff' }}>
                      <div style={{ width: 180, height: 110, borderRadius: 16, background: course.thumbnail ? `url(${course.thumbnail}) center/cover no-repeat` : '#f1f5f9', flexShrink: 0, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.1)' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Active Certification</div>
                         <h3 style={{ fontSize: 20, fontWeight: 900, color: C.text, margin: '0 0 10px' }}>{course.title}</h3>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar user={{ name: course.instructor }} size={24} />
                            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Instructor: <strong style={{color: C.text}}>{course.instructor}</strong></span>
                         </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                         <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                            <Icon name="chevron-right" size={20} />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <div style={{ background: '#f8fafc', width: 80, height: 80, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#cbd5e1' }}>
                    <Icon name="book-open" size={32} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 12 }}>No Active Path</h3>
                  <p style={{ color: C.muted, fontSize: 16, marginBottom: 32, maxWidth: 300, margin: '0 auto 32px', lineHeight: 1.6 }}>You haven't enrolled in any elite certifications yet. Start your journey today.</p>
                  <Btn onClick={() => navigate('/')} size="lg" style={{ borderRadius: 16 }}>Explore Certifications</Btn>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', width: '100%', background: active ? C.text : 'transparent', border: 'none', borderRadius: 16, cursor: 'pointer', fontSize: 14, fontWeight: 800, color: active ? '#fff' : C.muted, textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: active ? C.shadow : 'none' }}>
    <div style={{ width: 32, height: 32, borderRadius: 10, background: active ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#fff' : C.muted }}>
      <Icon name={icon} size={16} />
    </div>
    {label}
  </button>
);

export default ProfilePage;
