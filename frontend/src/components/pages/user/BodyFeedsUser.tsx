import React, { useState, useEffect } from 'react';

// Shimmer effect component
const ShimmerFeed = () => (
  <div className="bg-[#0A1E32] rounded-lg p-4 mb-4 animate-pulse">
    <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-400 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-400 rounded w-1/4"></div>
  </div>
);

const Body = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       const fetchedFeeds = []; 
//       setFeeds(fetchedFeeds);
//       setLoading(false);
//     }, 2000); 
//   }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="w-full md:w-2/3 lg:w-1/2">
        {loading
          ? [...Array(5)].map((_, index) => <ShimmerFeed key={index} />)
          : feeds.map((feed, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow-md">
                {/* Add feed content here */}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Body;
