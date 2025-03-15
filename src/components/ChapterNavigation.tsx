
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Chapter } from '@/services/blogService';

interface ChapterNavigationProps {
  slug: string;
  currentChapter: string;
  chapters: Chapter[];
  postTitle: string;
}

const ChapterNavigation = ({ slug, currentChapter, chapters, postTitle }: ChapterNavigationProps) => {
  // Find the current chapter index
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapter);
  
  // Determine previous and next chapters
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  
  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      {/* Chapter overview link */}
      <div className="mb-6 text-center">
        <Button variant="outline" asChild>
          <Link to={`/blog/${slug}`} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to {postTitle} Overview
          </Link>
        </Button>
      </div>
      
      {/* Next/Previous chapter navigation */}
      <div className="flex justify-between mt-4">
        {prevChapter ? (
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link to={`/blog/${slug}/${prevChapter.id}`}>
              <ArrowLeft size={16} />
              <span className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Previous</span>
                <span>{prevChapter.title}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex layout
        )}
        
        {nextChapter ? (
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link to={`/blog/${slug}/${nextChapter.id}`}>
              <span className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Next</span>
                <span>{nextChapter.title}</span>
              </span>
              <ArrowRight size={16} />
            </Link>
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex layout
        )}
      </div>
    </div>
  );
};

export default ChapterNavigation;
