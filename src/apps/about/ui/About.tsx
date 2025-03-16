
import { AboutHero, CoreStrengths, CurrentStatus, Skills, TechnicalConsulting } from "@/apps/about/ui/components";

import Contact from "@/shared/components/Contact";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <CurrentStatus />
      <CoreStrengths />
      
      {/* Clear separation between About Me and Services */}
      <div className="w-full h-16 bg-white"></div>
      
      <TechnicalConsulting />
      <Skills />
      <Contact />
    </div>
  );
};

export default About;
