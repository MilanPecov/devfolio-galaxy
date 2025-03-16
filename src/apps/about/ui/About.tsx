
import { Skills } from "@/apps/about";
import { Github, Linkedin, Mail, X, Users, } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

// Collection of programmer quotes
const quotes = [
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  },
  {
    text: "The only way to go fast, is to go well.",
    author: "Robert C. Martin (Uncle Bob)"
  },
];

const About = () => {
  const [quote, setQuote] = useState(quotes[0]);

  // Set a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  // Function to scroll to the contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* About Me Hero Section - Updated for better cohesion and flow */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with subtle pattern gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-white">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.6)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.6)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto">
            {/* Visual journey section */}
            <div className="flex flex-col sm:flex-row gap-8 items-center mb-12">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 relative">
                  About Me
                  <span className="absolute -bottom-2 left-0 w-20 h-1 bg-indigo-400"></span>
                </h1>
                <p className="text-xl text-gray-700 mt-6 leading-relaxed">
                  I'm an <span className="font-semibold text-indigo-700">Engineering Leader</span> who 
                  builds bridges — between teams, technologies, and business goals.
                </p>
              </div>
              
              {/* Quote card with gradient background */}
              <div className="flex-1">
                <div className="p-6 bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD] rounded-xl shadow-sm transform rotate-1 hover:rotate-0 transition-transform">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    "{quote.text}"
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">— {quote.author}</p>
                </div>
              </div>
            </div>

            {/* Current Status/Role - Redesigned from My Journey */}
            <div className="mb-12 bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
              <div className="p-6 relative">
                <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-50 rounded-bl-[50px] -mr-2 -mt-2"></div>
                
                <div className="relative">
                  <h2 className="text-2xl font-bold text-gray-800 mb-5">Current Status</h2>
                  
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                        Director of Engineering at Showpass
                      </h3>
                      <p className="text-gray-700 mb-4">
                        As the <span className="font-medium">founding engineer</span>, I've been instrumental in building 
                        Showpass from the ground up for the past decade. My journey has evolved from writing the first line of code 
                        to now leading our engineering organization and technical vision.
                      </p>
                      <p className="text-gray-700">
                        I oversee our architectural decisions, engineering processes, and mentor our growing team
                        while ensuring we deliver exceptional experiences to event organizers and attendees alike.
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 p-5 rounded-lg md:w-1/3 flex flex-col justify-center">
                      <h4 className="text-sm uppercase tracking-wider text-indigo-700 font-semibold mb-3">Highlights</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 rounded-full bg-indigo-100 p-1 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span className="text-sm">10+ years building ticketing infrastructure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 rounded-full bg-indigo-100 p-1 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span className="text-sm">Technical strategy & architecture design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 rounded-full bg-indigo-100 p-1 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span className="text-sm">Engineering team leadership & mentorship</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core strengths with visual cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Core Strengths</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-[#E5DEFF] rounded-lg transform transition-all hover:scale-105 hover:shadow-md">
                  <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    <span className="p-1.5 bg-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M7 7h10" />
                        <path d="M7 12h10" />
                        <path d="M7 17h10" />
                      </svg>
                    </span>
                    Technical Vision
                  </h3>
                  <p className="text-sm text-gray-700">
                    Driving architecture decisions that balance innovation with stability and business goals
                  </p>
                </div>
                
                <div className="p-5 bg-[#FDE1D3] rounded-lg transform transition-all hover:scale-105 hover:shadow-md">
                  <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    <span className="p-1.5 bg-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </span>
                    Product Delivery
                  </h3>
                  <p className="text-sm text-gray-700">
                    Turning complex requirements into exceptional user experiences through technical execution
                  </p>
                </div>
                
                <div className="p-5 bg-[#D3E4FD] rounded-lg transform transition-all hover:scale-105 hover:shadow-md">
                  <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    <span className="p-1.5 bg-white rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </span>
                    Team Growth
                  </h3>
                  <p className="text-sm text-gray-700">
                    Mentoring engineers and building collaborative cultures that foster innovation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clear separation between About Me and Services */}
      <div className="w-full h-16 bg-white"></div>

      {/* Technical Consulting & Mentoring Section */}
      <section className="py-20 bg-indigo-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
              Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Consulting & Mentoring
            </h2>
            <p className="text-gray-600 mb-8">
              I help organizations and individuals unlock their potential through tailored technical guidance and hands-on support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white border-indigo-100 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-indigo-100 rounded-full w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Architectural Strategy</h3>
                <p className="text-gray-600">
                  Develop a coherent technical vision that aligns with business objectives, whether you're a startup planning for growth or an enterprise modernizing systems.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-indigo-100 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-indigo-100 rounded-full w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Legacy Codebase Resurrection</h3>
                <p className="text-gray-600">
                  I specialize in excavating business logic from legacy codebases, making them maintainable and extensible again through incremental refactoring strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-indigo-100 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-indigo-100 rounded-full w-fit">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team & Individual Mentoring</h3>
                <p className="text-gray-600">
                  Personalized guidance for development teams and individual engineers looking to advance their skills, implement best practices, and achieve their technical goals.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button 
              className="bg-indigo-400 hover:bg-indigo-500"
              onClick={scrollToContact}
            >
              Discuss Your Project
            </Button>
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
