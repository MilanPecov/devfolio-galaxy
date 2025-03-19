
import { ArrowRight, BrainCircuit, Code, Database, Server } from "lucide-react";
import { useTypewriter } from "@/apps/landing/hooks/useTypewriter.tsx";

const Hero = () => {
  // Typewriter effect for the ls command output.
  const { displayText, showCursor } = useTypewriter(
    "dr-xr-xr-x  Director of Engineering\n" +
      "drwxr--r--  Tech Lead\n" +
      "drwxrwxrwx  Founding Engineer\n" +
      "dr--r--r--  Technical Mentor & Advisor",
    30
  );

  return (
    <section
      className="
        relative
        min-h-screen       /* Allows scrolling if content is taller than screen */
        flex flex-col
        items-center
        justify-center
        py-8               /* Adequate top/bottom padding on mobile */
        sm:py-20
        overflow-hidden
      "
    >
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none z-0" />

      {/* Decorative Icons - hidden on mobile, show on sm+ */}
      <Server
        className="hidden sm:block absolute top-20 left-10 text-indigo-500 w-24 h-24 rotate-12 opacity-20 z-10"
      />
      <Database
        className="hidden sm:block absolute bottom-20 right-10 text-indigo-500 w-24 h-24 -rotate-12 opacity-20 z-10"
      />
      <Code
        className="hidden sm:block absolute top-40 right-20 text-indigo-500 w-16 h-16 rotate-45 opacity-15 z-10"
      />
      <BrainCircuit
        className="hidden sm:block absolute bottom-40 left-20 text-indigo-500 w-20 h-20 -rotate-45 opacity-15 z-10"
      />

      {/* Main Content Container */}
      <div
        className="
          container
          mx-auto
          px-6
          relative
          z-20
          animate-fade-up
        "
      >
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Personal Tagline */}
          <div className="text-center">
            <h1
              className="
                text-3xl
                sm:text-4xl
                font-bold
                text-gray-900
                mb-2
              "
            >
              Hello, I&apos;m Milan
            </h1>
            <p className="text-base sm:text-lg text-gray-700">
              I build software and the teams that build software.
            </p>
          </div>

          {/* Terminal-Like Interface */}
          <div
            className="
              text-sm
              sm:text-base
              text-gray-600
              max-w-2xl
              mx-auto
              leading-relaxed
              bg-gray-950/5
              rounded-lg
              p-4
              sm:p-6
              font-mono
              min-h-[180px]    /* Enough height to prevent layout jump */
              shadow-sm
            "
          >
            {/* "locate" command */}
            <div className="flex items-center gap-2 text-left mb-2">
              <span className="text-green-600">milan@home</span>
              <span className="text-gray-500">:~$</span>
              <span className="text-indigo-600">locate</span>
            </div>
            <div className="pl-8 text-left">Calgary, Canada</div>

            {/* "ls" command for roles */}
            <div className="flex items-center gap-2 text-left mt-4 mb-2">
              <span className="text-green-600">milan@home</span>
              <span className="text-gray-500">:~$</span>
              <span className="text-indigo-600 break-words">
                ls -la /home/milan/roles
              </span>
            </div>

            <div className="pl-8 text-left min-h-[80px] whitespace-pre-line break-words">
              {displayText}
              {showCursor ? (
                <span className="inline-block w-1 h-5 ml-1 bg-indigo-400 animate-pulse" />
              ) : (
                // Always reserve space with a hidden element when typing is complete.
                <span
                  className="inline-block w-1 h-5 ml-1"
                  style={{ visibility: "hidden" }}
                />
              )}
            </div>

            {/* Final prompt rendered after the typewriter finishes */}
            {!showCursor && (
              <div className="flex items-center gap-2 text-left mt-2">
                <span className="text-green-600">milan@home</span>
                <span className="text-gray-500">:~$</span>
              </div>
            )}
          </div>

          {/* Personal Note */}
          <div className="max-w-xl mx-auto text-center text-gray-600">
            <p>
              Passionate about clean code, scalable architecture, and driving
              innovation.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#blog"
              className="
                group
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                bg-gradient-to-r
                from-indigo-600
                to-indigo-500
                text-white
                px-8
                py-4
                rounded-lg
                hover:from-indigo-500
                hover:to-indigo-600
                transition-all
                duration-300
                shadow-lg
                shadow-indigo-500/20
                hover:shadow-xl
                hover:shadow-indigo-500/30
              "
            >
              Read Tech Insights
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#contact"
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                bg-white
                hover:bg-gray-50
                text-gray-900
                px-8
                py-4
                rounded-lg
                transition-all
                duration-300
                shadow-lg
                shadow-indigo-500/5
                hover:shadow-xl
                hover:shadow-indigo-500/10
                border
                border-gray-200
              "
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
