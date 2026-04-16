import { Download, FileText, Layout, Award, UserPlus } from 'lucide-react';

const CourseSidebar = () => {
  return (
    <aside className="space-y-8">
      {/* Course Summary Card */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm sticky top-24">
        <h3 className="text-lg font-bold mb-4">Course summary</h3>
        
        <ul className="space-y-4 mb-6">
          <li className="flex items-center gap-3 text-sm text-text-secondary">
            <Layout className="h-4 w-4" />
            <span>14 lessons (2h 25m)</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary">
            <Download className="h-4 w-4" />
            <span>25 additional resources</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary">
            <FileText className="h-4 w-4" />
            <span>10 practice exercises</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary">
            <Award className="h-4 w-4" />
            <span>Course certificate included</span>
          </li>
        </ul>

        <div className="pt-6 border-t border-border space-y-4">
          <button className="btn-primary w-full py-3 justify-center">
            Buy course
          </button>
          <button className="w-full py-3 border border-border rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary/50">
            <UserPlus className="h-4 w-4" />
            Give as a gift
          </button>
        </div>
        
        <p className="text-[10px] text-center text-text-secondary mt-4 uppercase tracking-widest font-bold">
          Pay with LitePass & save 20%
        </p>
      </div>

      {/* Instructor Card */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-accent">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=monica" 
              alt="Mónica Vega" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold">Mónica Vega</h4>
            <div className="flex gap-1 mt-1">
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold">TEACHER</span>
              <span className="text-[10px] bg-accent-light text-accent-dark px-1.5 py-0.5 rounded font-bold">PLUS</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">Designer & Light Expert</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Mónica is a leading interior lighting designer with over 15 years of experience in luxury residential and museum lighting.
        </p>
        <button className="mt-4 text-accent text-sm font-bold hover:underline">
          View full profile
        </button>
      </div>
    </aside>
  );
};

export default CourseSidebar;
