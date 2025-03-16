
import { Hero, Contact } from "@/apps/landing";
import Blog from "@/apps/blog/ui/Blog.tsx";
import Navbar from "@/components/Navbar";

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
