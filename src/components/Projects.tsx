
import { Github, ExternalLink, Youtube } from "lucide-react";

const projects = [
  {
    title: "AI-Powered Customer Support",
    description: "RAG application built with Django, LangChain, and Pinecone for streamlined customer support, integrated with various documentation sources.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    tech: ["Django", "LangChain", "Pinecone", "Streamlit"],
    year: "2023-2024",
  },
  {
    title: "N-Puzzle Solver Suite",
    description: "Python package implementing A* search algorithm with various heuristics to efficiently solve the 15-puzzle problem.",
    image: "https://images.unsplash.com/photo-1616486788371-62d930495c44",
    tech: ["Python", "A* Algorithm", "Heuristic Search"],
    year: "2017-2018",
  },
  {
    title: "Intelligent Robotic Connect Four",
    description: "Advanced system combining computer vision, AI, and robotics to enable a robot to play Connect Four against human players.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    tech: ["Computer Vision", "AI", "Robotics"],
    year: "2013-2014",
    videoUrl: "https://www.youtube.com/watch?v=Ik9_9VnBTjw",
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
            A selection of projects showcasing my expertise in AI, robotics, and software development.
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <span className="text-sm text-gray-500">{project.year}</span>
                </div>
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
                {project.videoUrl && (
                  <div className="flex gap-4">
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Youtube size={20} />
                      Watch Demo
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
