import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
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

const CourseRoute = ({ courses, handleEnroll, user }) => {
  const { id } = useParams();
  const course = (courses || []).find(c => c.id === parseInt(id));
  
  if (!courses || courses.length === 0) return null; 
  if (!course) return <Navigate to="/" />;

  return <CourseDetail course={course} onEnroll={handleEnroll} isLoggedIn={!!user} />;
};

export default function App() {
  const { 
    courses, 
    fetchCourses, 
    user, 
    token,
    isLoading,
    init
  } = useLmsStore();

  const navigate = useNavigate();

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false, type: 'success' });

  useEffect(() => {
    init();
    fetchCourses();
  }, [fetchCourses, init]);

  const showMsg = (msg, type = 'success') => {
    setToast({ msg, visible: true, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/sign-up');
    } else {
      setShowPhoneModal(true);
    }
  };

  const handlePhoneVerified = () => {
    setShowPhoneModal(false);
    showMsg('Enrollment successful! Redirecting to student dashboard...', 'success');
  };

  return (
    <>
      <PublicNav onLoginClick={() => navigate('/sign-up')} />

      <Routes>
        <Route path="/" element={<PublicLanding courses={courses} onCourse={c => navigate(`/course/${c.id}`)} />} />
        
        <Route path="/sign-up" element={
          user ? (
            user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />
          ) : (
            <AuthPage onBack={() => navigate('/')} />
          )
        } />
        
        <Route path="/course/:id" element={<CourseRoute courses={courses} handleEnroll={handleEnroll} user={user} />} />
        
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

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

      <Toast message={toast.msg} visible={toast.visible} type={toast.type} />

      {isLoading && (
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999 }}>
          <div className="animate-spin" style={{ width: 24, height: 24, border: '3px solid #e11d48', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      )}
    </>
  );
}
