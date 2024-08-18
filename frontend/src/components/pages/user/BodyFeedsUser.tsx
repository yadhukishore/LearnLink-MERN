import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

interface Feed {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
  };
  files: Array<{
    url: string;
    fileType: string;
  }>;
  createdAt: string;
}

const ShimmerFeed: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-[#0A1E32] rounded-lg p-4 mb-4 animate-pulse"
  >
    <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-400 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-400 rounded w-1/4"></div>
  </motion.div>
);

const BodyFeedsUser: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get<Feed[]>('http://localhost:8000/api/user/feeds');
        setFeeds(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feeds:', error);
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="w-full md:w-2/3 lg:w-1/2">
        {loading ? (
          [...Array(5)].map((_, index) => <ShimmerFeed key={index} />)
        ) : feeds.length > 0 ? (
          feeds.map((feed) => (
            <motion.div
              key={feed._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 mb-6 shadow-lg text-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  {feed.user.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feed.user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(feed.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-lg">{feed.content}</p>
              {feed.files.map((file, index) => (
                <div key={index} className="mt-4">
                  {file.fileType.startsWith('image') ? (
                    <img src={file.url} alt="Feed content" className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" />
                  ) : (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                      <FaShare className="mr-2" /> View attached file
                    </a>
                  )}
                </div>
              ))}
              <div className="mt-6 flex justify-between items-center">
                <button className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-300">
                  <FaHeart className="mr-2" /> Like
                </button>
                <button className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300">
                  <FaComment className="mr-2" /> Comment
                </button>
                <button className="flex items-center text-green-500 hover:text-green-600 transition-colors duration-300">
                  <FaShare className="mr-2" /> Share
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-center text-xl"
          >
            No feeds available. Be the first to post!
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default BodyFeedsUser;