
export const CurrentStatus = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        {/* Current Status/Role - Redesigned from My Journey */}
        <div className="mb-12 bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-50 rounded-bl-[50px] -mr-2 -mt-2"></div>
            
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">Current Status</h2>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                    Director of Engineering at Showpass
                  </h3>
                  <p className="text-gray-700 mb-4">
                    As the <span className="font-medium">founding engineer</span>, I've been instrumental in building 
                    Showpass from the ground up for the past decade. My journey has evolved from writing the first line of code 
                    to now leading our engineering organization and technical vision.
                  </p>
                  <p className="text-gray-700">
                    I oversee our architectural decisions, engineering processes, and mentor our growing team
                    while ensuring we deliver exceptional experiences to event organizers and attendees alike.
                  </p>
                </div>
                
                <div className="bg-indigo-50 p-5 rounded-lg md:w-1/3 flex flex-col justify-center">
                  <h4 className="text-sm uppercase tracking-wider text-indigo-700 font-semibold mb-3">Highlights</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 rounded-full bg-indigo-100 p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="text-sm">10+ years building ticketing infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 rounded-full bg-indigo-100 p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="text-sm">Technical strategy & architecture design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 rounded-full bg-indigo-100 p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="text-sm">Engineering team leadership & mentorship</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
