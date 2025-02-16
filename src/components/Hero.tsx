
import { ArrowRight, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-sm font-medium mb-4">
            <MapPin size={16} />
            Calgary, Canada
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Milan Pecov
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Engineering leader with a proven track record in scaling teams and building enterprise-grade ticketing systems. Specializing in high-performance architectures and cloud infrastructure.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-[#1E293B] text-white px-6 py-3 rounded-lg hover:bg-[#334155] transition-colors duration-300"
            >
              View Projects
              <ArrowRight size={20} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#1E293B] px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
