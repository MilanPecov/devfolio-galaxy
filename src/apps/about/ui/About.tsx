
import { Skills } from "@/apps/about";
import { AboutHero } from "./AboutHero";
import { CurrentStatus } from "./CurrentStatus";
import { CoreStrengths } from "./CoreStrengths";
import { TechnicalConsulting } from "./TechnicalConsulting";
import Contact from "@/shared/components/Contact";
import { useEffect } from "react";

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
