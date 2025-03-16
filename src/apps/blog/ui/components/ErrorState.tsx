
import { Link } from "react-router-dom";

interface ErrorStateProps {
  error: string | null;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{error || "Post not found"}</h1>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800">
          Return to blog
        </Link>
      </div>
    </div>
  );
};
