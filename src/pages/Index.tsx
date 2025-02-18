import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Blog />
      <Skills />
      <Contact />
    </div>
  );
};

export default Index;
