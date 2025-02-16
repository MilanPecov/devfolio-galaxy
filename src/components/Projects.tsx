
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Project One",
    description: "A full-stack application built with React and Node.js",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "Project Two",
    description: "E-commerce platform with real-time inventory management",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "Project Three",
    description: "Real-time collaboration tool for remote teams",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    tech: ["Vue.js", "Firebase", "Tailwind CSS", "WebRTC"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-medium mb-4">
            Projects
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Work
          </h2>
          <p className="text-gray-600">
            A collection of projects that showcase my skills and experience in
            web development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.githubUrl}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github size={20} />
                    Code
                  </a>
                  <a
                    href={project.liveUrl}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
