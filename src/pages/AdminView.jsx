import { Plus, BarChart, Settings, CreditCard, Layout, Users } from 'lucide-react';

const AdminView = () => {
  return (
    <div className="grid grid-cols-sidebar h-screen">
      {/* Sidebar */}
      <aside className="border-r p-8 flex flex-col gap-8">
        <div className="label">Literight Admin</div>
        <nav className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3 font-bold border-b pb-2">
            <Layout className="h-4 w-4" /> Courses
          </div>
          <div className="flex items-center gap-3 text-text-secondary hover:text-black cursor-pointer">
            <Users className="h-4 w-4" /> Students
          </div>
          <div className="flex items-center gap-3 text-text-secondary hover:text-black cursor-pointer">
            <BarChart className="h-4 w-4" /> Analytics
          </div>
          <div className="flex items-center gap-3 text-text-secondary hover:text-black cursor-pointer">
            <CreditCard className="h-4 w-4" /> Payments
          </div>
          <div className="flex items-center gap-3 text-text-secondary hover:text-black cursor-pointer">
            <Settings className="h-4 w-4" /> Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="title">Course Management</h1>
          <button className="btn-raw flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create New Course
          </button>
        </header>

        <div className="flex flex-col gap-12">
          {/* Section: Course Builder Placeholder */}
          <section>
            <div className="label">Live Courses</div>
            <div className="placeholder-box h-40 text-center">
              (0 Active Courses) <br/> Click "Create New Course" to begin scaffolding curriculum.
            </div>
          </section>

          {/* Section: Payment Portal Setup */}
          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="label">Payment Portal: Razorpay</div>
              <div className="placeholder-box h-32 flex-col gap-2">
                <span className="text-xs">API KEY: [NOT CONFIGURED]</span>
                <button className="btn-raw secondary text-[0.6rem]">Connect Razorpay</button>
              </div>
            </div>
            <div>
              <div className="label">Payment Portal: Stripe</div>
              <div className="placeholder-box h-32 flex-col gap-2">
                <span className="text-xs">SECRET KEY: [NOT CONFIGURED]</span>
                <button className="btn-raw secondary text-[0.6rem]">Connect Stripe</button>
              </div>
            </div>
          </section>

          {/* Section: Content Editor Placeholder */}
          <section>
            <div className="label">Global Content Settings</div>
            <div className="placeholder-box h-64">
              Content Management System Placeholder <br/>
              (Digital Assets / PDF Resources / Video Library)
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminView;
