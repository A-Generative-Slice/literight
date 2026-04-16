import { ChevronRight, Star, Users, Globe } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-white border-b border-border pt-6">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
          <span className="cursor-pointer hover:text-accent">Courses</span>
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:text-accent">My courses</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary font-medium">Lighting Design for Interior Spaces</span>
        </div>

        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2">
              Lighting Design for Interior Spaces
            </h1>
            <p className="text-text-secondary font-medium">
              A course by <span className="text-text-primary">Mónica Vega</span>, Designer
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <span className="badge badge-amber">Best Seller</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-bold">97%</span>
                <span className="text-text-secondary">positive reviews (701)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-text-secondary" />
                <span className="font-bold">28,173</span>
                <span className="text-text-secondary">students</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-text-secondary" />
                <span className="text-text-secondary">Audio: English, Spanish, German...</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-xs text-text-secondary line-through block">32,99€</span>
              <span className="text-2xl font-bold">19,99€</span>
              <span className="ml-2 badge badge-amber">40% OFF</span>
            </div>
            <button className="btn-primary w-full md:w-auto">
              Enroll Now
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b-2 border-transparent">
          {['Information', 'Content', 'Community', 'Projects'].map((tab, i) => (
            <div 
              key={tab}
              className={`pb-4 text-sm font-semibold cursor-pointer transition-all ${
                i === 1 ? 'border-b-2 border-accent text-accent' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
