
import { ArrowRight, MapPin, Database, Server } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.6)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.6)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-[#F8FAFC]"></div>
      </div>
      
      {/* Decorative elements */}
      <Server className="absolute top-20 left-10 text-gray-100 w-24 h-24 rotate-12 opacity-20" />
      <Database className="absolute bottom-20 right-10 text-gray-100 w-24 h-24 -rotate-12 opacity-20" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E293B]/5 text-[#1E293B] rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-[#1E293B]/10">
            <MapPin size={16} />
            Calgary, Canada
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#1E293B] leading-tight">
            Milan Pecov
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Engineering leader with a proven track record in scaling teams and building enterprise-grade ticketing systems. Specializing in high-performance architectures and cloud infrastructure.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href="#blog"
              className="group inline-flex items-center gap-2 bg-[#1E293B] text-white px-8 py-4 rounded-lg hover:bg-[#334155] transition-all duration-300 shadow-lg shadow-[#1E293B]/5 hover:shadow-xl hover:shadow-[#1E293B]/10"
            >
              Read Tech Insights
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E293B] px-8 py-4 rounded-lg transition-all duration-300 shadow-lg shadow-[#1E293B]/5 hover:shadow-xl hover:shadow-[#1E293B]/10 border border-gray-200"
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
