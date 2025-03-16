
import { Users } from "lucide-react";

export const CoreStrengths = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        {/* Core strengths with visual cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Core Strengths</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#E5DEFF] rounded-lg transform transition-all hover:scale-105 hover:shadow-md">
              <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <span className="p-1.5 bg-white rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                </span>
                Technical Vision
              </h3>
              <p className="text-sm text-gray-700">
                Driving architecture decisions that balance innovation with stability and business goals
              </p>
            </div>
            
            <div className="p-5 bg-[#FDE1D3] rounded-lg transform transition-all hover:scale-105 hover:shadow-md">
              <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <span className="p-1.5 bg-white rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
                Product Delivery
              </h3>
              <p className="text-sm text-gray-700">
                Turning complex requirements into exceptional user experiences through technical execution
              </p>
            </div>
            
            <div className="p-5 bg-[#D3E4FD] rounded-lg transform transition-all hover:scale-105 hover:shadow-md">
              <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <span className="p-1.5 bg-white rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </span>
                Team Growth
              </h3>
              <p className="text-sm text-gray-700">
                Mentoring engineers and building collaborative cultures that foster innovation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
