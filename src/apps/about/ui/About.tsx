
import { Skills } from "@/apps/about";
import { Github, Linkedin, Mail, X } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";

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
            
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm mb-8">
              <p className="text-lg text-gray-700 leading-relaxed italic">
                "Code is like humor. When you have to explain it, it's bad."
              </p>
              <p className="text-sm text-gray-500 mt-2">— Cory House</p>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              I'm an Engineering Leader who builds bridges — between teams, technologies, and business goals. 
              I've spent years crafting elegant solutions to complex problems while growing teams that thrive on innovation.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <div className="p-4 bg-[#E5DEFF] rounded-lg flex-1">
                <h3 className="font-semibold mb-2">Technical Vision</h3>
                <p className="text-sm text-gray-600">
                  Driving architecture decisions that balance innovation with stability
                </p>
              </div>
              <div className="p-4 bg-[#D3E4FD] rounded-lg flex-1">
                <h3 className="font-semibold mb-2">Team Growth</h3>
                <p className="text-sm text-gray-600">
                  Mentoring engineers and building collaborative cultures
                </p>
              </div>
              <div className="p-4 bg-[#FDE1D3] rounded-lg flex-1">
                <h3 className="font-semibold mb-2">Product Delivery</h3>
                <p className="text-sm text-gray-600">
                  Turning complex requirements into exceptional experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <Skills />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
              Connect With Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Feel free to reach out through any of these channels.
            </p>

            {/* Decorative element */}
            <div className="flex justify-center mb-8">
              <Separator className="w-24 bg-indigo-300" />
            </div>

            {/* Contact List */}
            <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="mailto:milan.pecov91@gmail.com"
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-indigo-100 hover:border-indigo-300 group"
              >
                <div className="p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-medium">E-mail</span>
              </a>

              <a
                href="https://www.linkedin.com/in/milan-pecov/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-indigo-100 hover:border-indigo-300 group"
              >
                <div className="p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Linkedin className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-medium">LinkedIn</span>
              </a>

              <a
                href="https://github.com/milanpecov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-indigo-100 hover:border-indigo-300 group"
              >
                <div className="p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Github className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-medium">GitHub</span>
              </a>

              <a
                href="https://x.com/milanpecov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-indigo-100 hover:border-indigo-300 group"
              >
                <div className="p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <X className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-medium">X</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
