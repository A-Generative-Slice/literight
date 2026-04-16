import React, { useState } from 'react';
import { C, Logo, Badge, Card } from '../components/Common';
import { Btn, Field } from '../components/Inputs';
import Icon from '../components/Icon';
import { useLmsStore } from '../stores/useLmsStore';

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
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: page === item.id ? 700 : 500, background: page === item.id ? C.accentLight : 'transparent', color: page === item.id ? C.accent : C.muted, textAlign: 'left', transition: 'all 0.1s' }}>
          <Icon name={item.icon} size={16} color={page === item.id ? C.accent : C.muted} />
          {item.label}
        </button>
      ))}
    </aside>
  );
};

const AdminCourses = ({ courses, onSaveCourse, onDeleteCourse }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [form, setForm] = useState({ 
    title: '', instructor: '', price: '', originalPrice: '', trailer: '', thumbnail: '', 
    passPercentage: 80, description: '', objective: '', sourceMaterial: '', tags: [], rating: 4.9, students: 0, duration: '3h 0m',
    chapters: [{ id: 'new-' + Date.now(), title: '', objective: '', lessons: [], quiz: [] }] 
  });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/uploads', formData);
      if (res.data.url) callback(res.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (c) => {
    setEditingCourseId(c.id);
    setForm({ ...c, tags: Array.isArray(c.tags) ? c.tags : [] });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingCourseId(null);
    setForm({ 
      title: '', instructor: '', price: '', originalPrice: '', trailer: '', thumbnail: '', 
      passPercentage: 80, description: '', objective: '', sourceMaterial: '', tags: [], rating: 4.9, students: 0, duration: '3h 0m',
      chapters: [{ id: 'new-' + Date.now(), title: '', objective: '', lessons: [], quiz: [] }] 
    });
    setShowForm(true);
  };

  const set = k => e => {
    const val = k === 'tags' ? e.target.value.split(',').map(t => t.trim()) : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
  };

  const addChapter = () => setForm(f => ({ ...f, chapters: [...f.chapters, { id: 'new-' + Date.now(), title: '', objective: '', lessons: [], quiz: [] }] }));
  const removeChapter = (id) => setForm(f => ({ ...f, chapters: f.chapters.filter(c => c.id !== id) }));
  const updateChapter = (id, field, val) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === id ? { ...c, [field]: val } : c) }));
  
  const addLesson = (chId) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, lessons: [...c.lessons, { id: 'new-' + Date.now(), title: '', video: '' }] } : c) }));
  const removeLesson = (chId, lesId) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, lessons: c.lessons.filter(l => l.id !== lesId) } : c) }));
  const updateLesson = (chId, lesId, field, val) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, lessons: c.lessons.map(l => l.id === lesId ? { ...l, [field]: val } : l) } : c) }));
  
  const addQuiz = (chId) => setForm(f => ({ ...f, chapters: f.chapters.map(c => c.id === chId ? { ...c, quiz: [...c.quiz, { id: 'new-' + Date.now(), question: '', options: ['', '', '', ''], correct: 0 }] } : c) }));
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
    onSaveCourse(form);
    setShowForm(false); 
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header ... */}
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
            <div style={{ display: 'flex', gap: 10 }}>
              {editingCourseId && <Btn variant="danger" size="sm" onClick={() => { if(confirm('Delete course permanently?')) onDeleteCourse(editingCourseId); setShowForm(false); }}>Delete Entire Course</Btn>}
              <Btn variant="ghost" onClick={() => setShowForm(false)}><Icon name="x" size={16} /></Btn>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section>
              <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: 16 }}>Basic Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Course Title" value={form.title} onChange={set('title')} required />
                <Field label="Instructor" value={form.instructor} onChange={set('instructor')} required />
                <Field label="Price (USD)" type="number" value={form.price} onChange={set('price')} />
                <Field label="Original Price" type="number" value={form.originalPrice} onChange={set('originalPrice')} />
                <Field label="Tags" value={(form.tags || []).join(', ')} onChange={set('tags')} />
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: C.muted }}>Curriculum Builder</h4>
                <Btn variant="secondary" size="sm" onClick={addChapter}>+ Add Chapter</Btn>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {form.chapters?.map((ch, idx) => (
                  <Card key={ch.id} style={{ background: C.surface, borderStyle: 'dashed', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 20, right: 20 }}>
                      <Btn variant="ghost" size="sm" onClick={() => removeChapter(ch.id)}><Icon name="trash" size={14} color={C.danger} /></Btn>
                    </div>
                    <Field label={`Chapter ${idx + 1}`} value={ch.title} onChange={e => updateChapter(ch.id, 'title', e.target.value)} />
                    <div style={{ marginLeft: 20, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {ch.lessons?.map((l, lIdx) => (
                        <div key={l.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                           <Badge label={lIdx + 1} />
                          <input placeholder="Lesson Title" value={l.title} onChange={e => updateLesson(ch.id, l.id, 'title', e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: `1px solid ${C.border}` }} />
                          <input type="file" style={{ display: 'none' }} id={`file-${l.id}`} onChange={e => handleFileUpload(e.target.files[0], url => updateLesson(ch.id, l.id, 'video', url))} />
                          <Btn variant="secondary" size="sm" onClick={() => document.getElementById(`file-${l.id}`).click()}>
                            <Icon name="upload" size={12} /> {l.video ? 'Uploaded' : 'Upload Video'}
                          </Btn>
                          <Btn variant="ghost" size="sm" onClick={() => removeLesson(ch.id, l.id)}><Icon name="x" size={14} color={C.danger} /></Btn>
                        </div>
                      ))}
                      <Btn variant="ghost" size="sm" onClick={() => addLesson(ch.id)}>+ Add Lesson</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 40, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setShowForm(false)}>Discard</Btn>
            <Btn onClick={save}>Save & Publish</Btn>
          </div>
        </Card>
      )}

      <Card padding="0" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 130px', padding: '12px 20px', background: '#111', color: '#fff' }}>
          <span>Title</span><span>Students</span><span>Revenue</span><span>Status</span><span>Actions</span>
        </div>
        {courses.map(c => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 130px', padding: '16px 20px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
            <div style={{ fontWeight: 600 }}>{c.title}</div>
            <div>{c.students}</div>
            <div style={{ color: C.success }}>${(c.students * c.price).toLocaleString()}</div>
            <Badge label="Published" color={C.success} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn size="sm" variant="secondary" onClick={() => handleEdit(c)}>Edit</Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const [page, setPage] = useState('courses');
  const { courses, saveCourse, logout } = useLmsStore();

  const pages = {
    courses: <AdminCourses courses={courses} onSaveCourse={saveCourse} />,
    content: <div style={{ padding: 40 }}>Content Manager - Comiong Soon</div>,
    students: <div style={{ padding: 40 }}>Student List - Coming Soon</div>,
    analytics: <div style={{ padding: 40 }}>Analytics View - Coming Soon</div>,
    payments: <div style={{ padding: 40 }}>Payment Gateways - Coming Soon</div>,
    settings: (
      <div style={{ padding: 40 }}>
        <h1>Settings</h1>
        <Btn variant="danger" onClick={logout}>Log Out</Btn>
      </div>
    ),
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar page={page} setPage={setPage} />
      <main style={{ marginLeft: 230, flex: 1, padding: '36px 40px', background: C.bg }}>
        {pages[page]}
      </main>
    </div>
  );
};

export default AdminDashboard;
