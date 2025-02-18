
import { ArrowRight, MapPin, Database, Server } from "lucide-react";
import { useCallback } from "react";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { useTypewriter } from "@/hooks/useTypewriter";

const Hero = () => {
  const { displayText, isTyping, showCursor } = useTypewriter(
    "Software Engineering Leader with a proven track record in scaling teams and building enterprise-grade ticketing systems.",
    50,
    "milan@home:~$ "
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
              value: "transparent",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#4F46E5",
            },
            links: {
              color: "#4F46E5",
              distance: 150,
              enable: true,
              opacity: 0.15,
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
              value: 0.2,
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Grid background pattern with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(79,70,229,0.1)_1px,transparent_1px),linear-gradient(rgba(79,70,229,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/95"></div>
      </div>
      
      {/* Decorative elements */}
      <Server className="absolute top-20 left-10 text-indigo-500 w-24 h-24 rotate-12 opacity-20" />
      <Database className="absolute bottom-20 right-10 text-indigo-500 w-24 h-24 -rotate-12 opacity-20" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4 border border-indigo-100 shadow-sm">
            <MapPin size={16} />
            Calgary, Canada
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Milan Pecov
          </h1>
          <div className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed min-h-[84px] bg-gray-950/5 rounded-lg p-6 font-mono">
            <div className="flex items-center gap-2 text-left mb-2">
              <span className="text-green-600">milan@home</span>
              <span className="text-gray-500">:~$</span>
              <span className="text-indigo-600">whoami</span>
            </div>
            <div className="text-left">
              {displayText}
              {showCursor && (
                <span className="inline-block w-2 h-5 ml-1 bg-indigo-400 animate-pulse" />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#blog"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-4 rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
            >
              Read Tech Insights
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 border border-gray-200"
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
