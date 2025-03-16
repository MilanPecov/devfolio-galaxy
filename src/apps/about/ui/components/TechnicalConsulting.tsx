
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { Users } from "lucide-react";

export const TechnicalConsulting = () => {
  // Function to scroll to the contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  return (
    <section className="py-20 bg-indigo-50/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* Decorative element above section title */}
          <div className="inline-block relative mb-6">
            <span className="inline-block px-6 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium relative z-10">
              Services
            </span>
            <div className="absolute w-full h-3 bg-gradient-to-r from-indigo-200/0 via-indigo-300/50 to-indigo-200/0 bottom-0 left-0 rounded-full"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Technical Consulting & Mentoring
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            I help organizations and individuals unlock their potential through tailored technical guidance and hands-on support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Service Card 1 */}
          <Card className="bg-white border-indigo-100 overflow-visible group hover:shadow-md transition-all hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative">
                {/* Icon positioned for better alignment with title */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 bg-indigo-100/90 rounded-full group-hover:bg-indigo-200 transition-colors backdrop-blur-sm border border-indigo-200/50 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                
                {/* Content area with sufficient padding from top to accommodate icon */}
                <div className="p-6 pt-12 text-center">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Architectural Strategy</h3>
                  <p className="text-gray-600">
                    Develop a coherent technical vision that aligns with business objectives, whether you're a startup planning for growth or an enterprise modernizing systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Card 2 */}
          <Card className="bg-white border-indigo-100 overflow-visible group hover:shadow-md transition-all hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative">
                {/* Icon positioned for better alignment with title */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 bg-orange-100/90 rounded-full group-hover:bg-orange-200 transition-colors backdrop-blur-sm border border-orange-200/50 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                
                {/* Content area with sufficient padding from top to accommodate icon */}
                <div className="p-6 pt-12 text-center">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Legacy Codebase Resurrection</h3>
                  <p className="text-gray-600">
                    I specialize in excavating business logic from legacy codebases, making them maintainable and extensible again through incremental refactoring strategies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Card 3 */}
          <Card className="bg-white border-indigo-100 overflow-visible group hover:shadow-md transition-all hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative">
                {/* Icon positioned for better alignment with title */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 bg-blue-100/90 rounded-full group-hover:bg-blue-200 transition-colors backdrop-blur-sm border border-blue-200/50 shadow-sm">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                
                {/* Content area with sufficient padding from top to accommodate icon */}
                <div className="p-6 pt-12 text-center">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Team & Individual Mentoring</h3>
                  <p className="text-gray-600">
                    Personalized guidance for development teams and individual engineers looking to advance their skills, implement best practices, and achieve their technical goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to action button with improved styling */}
        <div className="mt-16 text-center">
          <Button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg px-6 py-2 h-auto transition-all"
            onClick={scrollToContact}
          >
            Discuss Your Project
          </Button>
        </div>
      </div>
    </section>
  );
};
