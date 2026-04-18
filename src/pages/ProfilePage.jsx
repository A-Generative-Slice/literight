import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, Avatar, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProfilePage = () => {
  const { user, token, setUser, courses, updateProfile, uploadFile } = useLmsStore();
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
    if (res.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage(res.error || 'Error saving profile');
    }
    setSaving(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSaving(true);
    setMessage('Uploading image...');
    const res = await uploadFile(file);
    if (res.success) {
      // Update profile with new DP URL
      const updateRes = await updateProfile(name, res.url);
      if (updateRes.success) {
        setMessage('Profile picture updated!');
      } else {
        setMessage('Picture uploaded but profile update failed.');
      }
    } else {
      setMessage('Failed to upload image.');
    }
    setSaving(false);
  };

  const enrolledCourses = courses.filter(c => user.enrolledCourseIds?.includes(c.id));

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
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: C.text }}>{user.name || user.username}</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>{user.username}</p>
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
                    <div style={{ padding: 12, borderRadius: 8, marginBottom: 24, background: message.includes('success') || message.includes('updated') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') || message.includes('updated') ? '#16a34a' : '#ef4444', fontSize: 14, fontWeight: 500 }}>
                      {message}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 10 }}>
                      <Avatar user={user} size={64} />
                      <div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          style={{ display: 'none' }} 
                          accept="image/*" 
                        />
                        <Btn variant="secondary" size="sm" onClick={() => fileInputRef.current.click()}>
                          Change Picture
                        </Btn>
                        <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>

                    <Field 
                      label="Full Name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Jane Doe" 
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
                  {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                    <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} style={{ display: 'flex', gap: 20, padding: 20, border: `1px solid ${C.border}`, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16 }} onMouseEnter={e => e.currentTarget.style.borderColor = C.accent} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <div style={{ width: 160, height: 100, borderRadius: 10, background: course.thumbnail ? `url(${course.thumbnail}) center/cover no-repeat` : C.surface, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{course.title}</h3>
                         <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
                           Instructor: {course.instructor}
                         </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                         <Icon name="chevron-right" color={C.muted} />
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <div style={{ background: C.surface, width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Icon name="book" size={24} color={C.muted} />
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>No courses yet</h3>
                      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>You haven't enrolled in any courses yet.</p>
                      <Btn onClick={() => navigate('/')}>Browse Courses</Btn>
                    </div>
                  )}
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
