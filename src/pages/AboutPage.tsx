
import { About, Skills } from "@/apps/about";
import Navbar from "@/shared/components/Navbar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AboutPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if URL contains #contact and scroll to it
    if (location.hash === "#contact") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Otherwise, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]); // Run effect when location changes

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <About />
      <Skills />
    </div>
  );
};

export default AboutPage;
