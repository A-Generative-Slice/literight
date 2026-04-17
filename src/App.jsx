import React, { useEffect, useState } from 'react';
import './index.css';
import { useLmsStore } from './stores/useLmsStore';

// Pages
import PublicLanding from './pages/PublicLanding';
import CourseDetail from './pages/CourseDetail';
import AdminDashboard from './pages/AdminPanel';
import AuthPage from './pages/AuthPage';

// Components
import { PublicNav } from './components/Navigation';
import Footer from './components/Footer';
import { Toast, Modal } from './components/UIExtras';
import { Btn } from './components/Inputs';
import Icon from './components/Icon';

export default function App() {
  const { 
    courses, 
    fetchCourses, 
    user, 
    token,
    isLoading,
    init
  } = useLmsStore();

  const [screen, setScreen] = useState('public'); // 'public', 'course', 'admin', 'auth'
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false, type: 'success' });

  useEffect(() => {
    init();
    fetchCourses();
  }, [fetchCourses, init]);

  // Handle routing logic (simplified for production v1)
  useEffect(() => {
    if (user?.role === 'admin' && screen === 'auth') {
      setScreen('admin');
    } else if (user?.role === 'student' && screen === 'auth') {
      setScreen('public');
    }
  }, [user, screen]);

  const activeCourse = (courses || []).find(c => c.id === selectedCourseId);

  const showMsg = (msg, type = 'success') => {
    setToast({ msg, visible: true, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleEnroll = () => {
    if (!user) {
      setScreen('auth');
    } else {
      setShowPhoneModal(true);
    }
  };

  const handlePhoneVerified = () => {
    setShowPhoneModal(false);
    showMsg('Enrollment successful! Redirecting to student dashboard...', 'success');
  };

  // Render Logic
  if (user?.role === 'admin' && screen === 'admin') {
    return <AdminDashboard />;
  }

  if (screen === 'auth') {
    return <AuthPage onBack={() => setScreen('public')} />;
  }

  return (
    <>
      <PublicNav 
        onLoginClick={() => setScreen('auth')} 
        setScreen={setScreen} 
      />

      {screen === 'course' && activeCourse ? (
        <CourseDetail 
          course={activeCourse} 
          onEnroll={handleEnroll} 
          isLoggedIn={!!user} 
        />
      ) : (
        <PublicLanding 
          courses={courses} 
          onCourse={c => {
            setSelectedCourseId(c.id);
            setScreen('course');
          }} 
        />
      )}

      <Footer />

      <Modal 
        open={showPhoneModal} 
        onClose={() => setShowPhoneModal(false)} 
        title="Verify Phone Number"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p style={{ marginBottom: 20 }}>Please verify your phone number to complete enrollment.</p>
          <Btn onClick={handlePhoneVerified}>Verify & Enroll</Btn>
        </div>
      </Modal>

      <Toast 
        message={toast.msg} 
        visible={toast.visible} 
        type={toast.type} 
      />

      {isLoading && (
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999 }}>
          <div className="animate-spin" style={{ width: 24, height: 24, border: '3px solid #e11d48', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      )}
    </>
  );
}
