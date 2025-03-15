
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import BlogPost from "@/pages/BlogPost";
import BlogListPage from "@/pages/BlogListPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import BlogChapter from "@/pages/BlogChapter";

const BASENAME = import.meta.env.MODE === "production" ? "/devfolio-galaxy" : "/";

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/:slug/:chapter" element={<BlogChapter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
