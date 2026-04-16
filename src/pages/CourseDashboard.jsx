import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Syllabus from '../components/Syllabus';
import CourseSidebar from '../components/CourseSidebar';
import ProjectsGrid from '../components/ProjectsGrid';
import SecurePlayer from '../components/SecurePlayer';
import { useProgress } from '../hooks/useProgress';

const CourseDashboard = () => {
  const { progress, updateLessonProgress, getLessonTimestamp } = useProgress('lighting-design-101');
  const activeLessonId = 'lesson-1'; // Mock active lesson

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <div className="container py-12">
          {/* Progress Banner (Domestika Perk) */}
          <div className="bg-accent-light/30 border border-accent/20 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-accent-dark">Course progress</h3>
              <div className="w-full md:w-80 h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-sm text-text-secondary">You've completed 2 lessons! Keep learning to earn your certificate.</p>
            </div>
            <button className="btn-primary">
              Continue to Unit 1
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Secure Video Player */}
              <div className="mb-12">
                <SecurePlayer 
                  url="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
                  lessonId={activeLessonId}
                  startTime={getLessonTimestamp(activeLessonId)}
                  onProgressUpdate={updateLessonProgress}
                />
              </div>

              <Syllabus progress={progress} />
              
              <div className="mt-16 space-y-8">
                <h3 className="text-xl font-bold">Recently viewed lessons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
                    <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
                    <img src="https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="w-full lg:w-80 shrink-0">
              <CourseSidebar />
            </div>
          </div>

          <ProjectsGrid />
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-border py-12 mt-12 text-sm">
        <div className="container flex flex-wrap justify-between gap-8">
          <div>
            <div className="title-font text-xl font-extrabold tracking-tighter mb-4">
              LITE<span className="text-accent">RIGHT</span> ACADEMY
            </div>
            <p className="max-w-xs text-text-secondary leading-relaxed">
              Professional training for architectural lighting designers, engineers, and visionaries.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="space-y-3">
              <h4 className="font-bold">Courses</h4>
              <ul className="text-text-secondary space-y-2">
                <li className="hover:text-accent cursor-pointer">Interior Design</li>
                <li className="hover:text-accent cursor-pointer">Facade Lighting</li>
                <li className="hover:text-accent cursor-pointer">Sustainable Light</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold">Company</h4>
              <ul className="text-text-secondary space-y-2">
                <li className="hover:text-accent cursor-pointer">About Us</li>
                <li className="hover:text-accent cursor-pointer">Contact</li>
                <li className="hover:text-accent cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-border text-center text-xs text-text-secondary">
          © 2026 Literight Academy. All rights reserved. Built with precision and light.
        </div>
      </footer>
    </div>
  );
};

export default CourseDashboard;
