
import { useState, useEffect } from "react";

// Collection of programmer quotes
const quotes = [
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  },
  {
    text: "The only way to go fast, is to go well.",
    author: "Robert C. Martin (Uncle Bob)"
  },
];

export const AboutHero = () => {
  const [quote, setQuote] = useState(quotes[0]);

  // Set a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with subtle pattern gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.6)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.6)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">
          {/* Visual journey section */}
          <div className="flex flex-col sm:flex-row gap-8 items-center mb-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 relative">
                About Me
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-indigo-400"></span>
              </h1>
              <p className="text-xl text-gray-700 mt-6 leading-relaxed">
                I'm an <span className="font-semibold text-indigo-700">Engineering Leader</span> who 
                builds bridges — between teams, technologies, and business goals.
              </p>
            </div>
            
            {/* Quote card with gradient background */}
            <div className="flex-1">
              <div className="p-6 bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD] rounded-xl shadow-sm transform rotate-1 hover:rotate-0 transition-transform">
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{quote.text}"
                </p>
                <p className="text-sm text-gray-600 mt-2 font-medium">— {quote.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
