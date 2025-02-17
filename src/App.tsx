
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import { Routes, Route } from "react-router-dom";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
