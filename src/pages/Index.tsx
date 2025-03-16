
import { Hero } from "@/apps/landing";
import Blog from "@/apps/blog/ui/Blog.tsx";
import Navbar from "@/shared/components/Navbar";
import Contact from "@/shared/components/Contact";

const Index = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Blog />
      <Contact />
    </div>
  );
};

export default Index;
