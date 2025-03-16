
import { Hero } from "@/apps/landing";
import Blog from "@/apps/blog/ui/Blog.tsx";
import Navbar from "@/shared/components/Navbar";

const Index = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Blog />
    </div>
  );
};

export default Index;
