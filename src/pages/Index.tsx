
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <Blog />
      <Contact />
    </div>
  );
};

export default Index;
