
import { Skills } from "@/apps/about";
import { Link } from "react-router-dom";
import { BookOpen, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Contact } from "@/apps/landing";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* About Me Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.6)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.6)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white/90 to-[#F8FAFC]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
              About Me
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              I'm a seasoned Engineering Leader with experience building high-performance 
              teams and scalable software systems. With a focus on clean architecture
              and sustainable engineering practices, I help organizations deliver
              exceptional products while fostering a culture of technical excellence.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="mailto:milan.pecov91@gmail.com">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/blog">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Read my blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <Skills />
      
      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default About;
