import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLmsStore } from '../stores/useLmsStore';
import { Card, Avatar, Badge, C } from '../components/Common';
import Icon from '../components/Icon';

const ProfilePage = () => {
  const { user, courses, updateProfile, uploadFile, isLoading } = useLmsStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/sign-up');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div style={{ height: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await updateProfile(name, user.dp);
    if (res.success) setMessage('IDENTITY UPDATED');
    else setMessage(res.error || 'ERROR_SAVING_IDENTITY');
    setSaving(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const res = await uploadFile(file);
    if (res.success) {
      await updateProfile(name, res.url);
      setMessage('AVATAR_SYNCED');
    }
    setSaving(false);
  };

  const enrolledCourses = (courses || []).filter(c => user.enrolledCourseIds?.includes(c.id));

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0a0a0a', paddingTop: 100 }}>
      
      {/* Cinematic Header */}
      <section style={{ padding: '60px var(--container-px)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
             <Avatar user={user} size={120} />
             <button 
              onClick={() => fileInputRef.current.click()}
              style={{ position: 'absolute', bottom: 10, right: 10, width: 32, height: 32, background: '#000', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
             >
               <Icon name="camera" size={14} color="#fff" />
             </button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', color: '#888', marginBottom: 12 }}>STUDENT PROFILE</div>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, textTransform: 'uppercase', color: '#000' }}>
              {(user.name || user.username.split('@')[0]).toUpperCase()}
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, width: '100%', maxWidth: 400 }}>
            <Badge label="Learning Path" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
            <Badge label="Account Settings" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '60px var(--container-px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          
          {activeTab === 'courses' && (
            <div className="reveal">
              <div style={{ display: 'grid', gap: 32 }}>
                {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                  <div 
                    key={course.id} 
                    onClick={() => navigate(`/course/${course.id}`)}
                    style={{ 
                      group: 'course',
                      display: 'flex', 
                      gap: 40, 
                      padding: 40, 
                      border: '1px solid rgba(0, 0, 0, 0.08)', 
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                      e.currentTarget.style.borderColor = '#000';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div style={{ width: 140, height: 140, background: course.thumbnail ? `url(${course.thumbnail}) center/cover` : '#eee', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#888', marginBottom: 16 }}>ACTIVE COURSE</div>
                      <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20, letterSpacing: '-0.02em', color: '#000' }}>{course.title.toUpperCase()}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                         <div style={{ flex: 1, height: 1, background: 'rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '35%', background: '#000' }} />
                         </div>
                         <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#666' }}>35% COMPLETE</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed rgba(0, 0, 0, 0.15)' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', color: '#888', marginBottom: 20 }}>NO ACTIVE COURSES</div>
                    <button 
                      onClick={() => navigate('/')}
                      style={{ background: '#000', color: '#fff', border: 'none', padding: '16px 32px', fontSize: 10, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}
                    >
                      EXPLORE CURRICULUM
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="reveal" style={{ maxWidth: 500 }}>
              <div style={{ marginBottom: 60 }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#888', marginBottom: 30 }}>PROFILE SETTINGS</div>
                
                <div style={{ marginBottom: 40 }}>
                   <label style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#666', display: 'block', marginBottom: 12 }}>FULL NAME</label>
                   <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter full name"
                    style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.15)', padding: '16px 0', color: '#000', fontSize: 16, outline: 'none' }}
                   />
                </div>

                <div style={{ marginBottom: 40 }}>
                   <label style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#666', display: 'block', marginBottom: 12 }}>EMAIL ADDRESS</label>
                   <input 
                    value={user.username}
                    readOnly
                    style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', padding: '16px 0', color: '#888', fontSize: 16, cursor: 'not-allowed' }}
                   />
                </div>

                {message && (
                  <div style={{ marginBottom: 30, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#000' }}>
                    {message.toUpperCase()}
                  </div>
                )}

                <button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: '#000', color: '#fff', border: 'none', padding: '20px 40px', fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em', width: '100%' }}
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>

              <div style={{ paddingTop: 40, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <button 
                    onClick={() => {
                      navigate('/logout');
                    }}
                    style={{ background: 'none', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#000', padding: '14px 24px', fontSize: 9, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.2em' }}
                  >
                    LOGOUT
                  </button>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default ProfilePage;
