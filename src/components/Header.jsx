import { Search, Bell, ShoppingCart, Menu, ChevronDown, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass sticky top-0 z-50 w-full py-3">
      <div className="container flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Menu className="h-6 w-6 lg:hidden" />
          <div className="flex items-center gap-1">
            <span className="title-font text-2xl font-extrabold tracking-tighter">
              LITE<span className="text-accent">RIGHT</span>
            </span>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
          <div className="flex items-center gap-1 cursor-pointer hover:text-accent">
            Courses <ChevronDown className="h-4 w-4" />
          </div>
          <a href="#" className="hover:text-accent">Projects</a>
          <a href="#" className="hover:text-accent">Plus</a>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center bg-secondary border border-border rounded-full px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-accent-light">
          <Search className="h-4 w-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search for courses..." 
            className="bg-transparent border-none outline-none w-full text-sm"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <Bell className="h-5 w-5 text-text-secondary hover:text-text-primary" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-white"></span>
          </div>
          <ShoppingCart className="h-5 w-5 text-text-secondary hover:text-text-primary cursor-pointer" />
          <div className="h-8 w-8 rounded-full bg-accent-light flex items-center justify-center cursor-pointer border border-accent">
            <User className="h-5 w-5 text-accent-dark" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
