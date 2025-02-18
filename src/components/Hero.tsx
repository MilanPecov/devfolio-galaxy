
import { ArrowRight, MapPin, Database, Server } from "lucide-react";
import { useCallback } from "react";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { useTypewriter } from "@/hooks/useTypewriter";

const Hero = () => {
  const { displayText, isTyping } = useTypewriter(
    "Engineering leader with a proven track record in scaling teams and building enterprise-grade ticketing systems.",
    50
  );

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#1E293B",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#FFFFFF",
            },
            links: {
              color: "#FFFFFF",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.1,
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10 opacity-10"
      />

      {/* Grid background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.3)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.3)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-[#F8FAFC]"></div>
      </div>
      
      {/* Decorative elements */}
      <Server className="absolute top-20 left-10 text-gray-100 w-24 h-24 rotate-12 opacity-20" />
      <Database className="absolute bottom-20 right-10 text-gray-100 w-24 h-24 -rotate-12 opacity-20" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E293B]/10 text-[#1E293B] rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-[#1E293B]/10">
            <MapPin size={16} />
            Calgary, Canada
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#1E293B] leading-tight">
            Milan Pecov
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed min-h-[84px]">
            {displayText}
            {isTyping && (
              <span className="inline-block w-1 h-5 ml-1 bg-gray-400 animate-pulse" />
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#blog"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white px-8 py-4 rounded-lg hover:from-[#334155] hover:to-[#1E293B] transition-all duration-300 shadow-lg shadow-[#1E293B]/10 hover:shadow-xl hover:shadow-[#1E293B]/20"
            >
              Read Tech Insights
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E2E8F0] hover:bg-[#F1F5F9] text-[#1E293B] px-8 py-4 rounded-lg transition-all duration-300 shadow-lg shadow-[#1E293B]/5 hover:shadow-xl hover:shadow-[#1E293B]/10 border border-[#CBD5E1]"
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
