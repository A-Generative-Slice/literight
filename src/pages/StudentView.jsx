import { Play, FileText, ChevronRight, Lock } from 'lucide-react';

const StudentView = () => {
  return (
    <div className="container py-12">
      {/* Header */}
      <header className="mb-12 border-b pb-8">
        <div className="label">Course Preview</div>
        <h1 className="title">Sample Course Title</h1>
        <p className="text-sm text-text-secondary mt-2">Professional instruction for Literight students.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Left: Trailer & Index */}
        <div className="md:col-span-2 space-y-12">
          {/* Trailer Section */}
          <section>
            <div className="label">Trailer Video</div>
            <div className="placeholder-box video-placeholder border-solid bg-black text-white">
              <div className="flex flex-col items-center gap-4">
                <Play className="h-12 w-12 fill-white" />
                <span>Watch Trailer</span>
              </div>
            </div>
          </section>

          {/* Syllabus Section */}
          <section>
            <div className="label">Curriculum Index</div>
            <div className="border divide-y">
              {[1, 2, 3, 4].map((unit) => (
                <div key={unit} className="p-4 flex items-center justify-between hover:bg-secondary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-text-secondary">U{unit}</span>
                    <span className="text-sm font-medium">Unit Title Placeholder</span>
                  </div>
                  <div className="flex items-center gap-4 text-text-secondary">
                    <span className="text-xs">15:00</span>
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Enrollment & Sidebar */}
        <div className="space-y-8">
          <section className="border p-8 rounded-sm">
            <div className="label">Access Level</div>
            <div className="text-2xl font-light mb-6">$199.00</div>
            
            <button className="btn-raw w-full py-4 mb-4">Enroll Now</button>
            <button className="btn-raw secondary w-full py-4 text-xs">Gift this Course</button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <FileText className="h-4 w-4" /> 12 Downloadable Resources
              </div>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <ChevronRight className="h-4 w-4" /> Lifetime Access
              </div>
            </div>
          </section>

          <section className="bg-secondary p-8 rounded-sm text-center">
            <div className="label">The Academy</div>
            <p className="text-xs leading-relaxed text-text-secondary">
              Premium learning experience for serious professionals. Powered by Literight.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentView;
