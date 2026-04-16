const projects = [
  {
    id: 1,
    title: "Mi proyecto final de iluminación",
    author: "gaby_gomez93",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Planos eléctricos e iluminación",
    author: "fnarvaez2187",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    title: "CASA FV",
    author: "marcogiamptietro88",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    title: "LOCAL",
    author: "asanchez_mtz",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=400"
  }
];

const ProjectsGrid = () => {
  return (
    <div className="py-12 border-t border-border mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Recent projects by students</h2>
        <button className="text-sm font-bold text-text-secondary hover:text-accent border-b border-border">
          See more
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group cursor-pointer">
            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow bg-slate-100">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="text-sm font-bold line-clamp-1 group-hover:text-accent transition-colors">{project.title}</h4>
            <p className="text-xs text-text-secondary mt-1">by {project.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;
