import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaEllipsisV } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Swal from 'sweetalert2';

interface Feed {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
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
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const fetchFeeds = async () => {
    try {
      const response = await apiService.get<Feed[]>('/user/feeds');
      setFeeds(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feeds:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds(); 
  }, []);

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleReport = async (feedId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to report this feed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, report it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await apiService.post(`/user/feedReport/${feedId}`);
        Swal.fire({
          title: 'Reported!',
          text: 'The feed has been reported successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Error reporting feed:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error reporting the feed.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleDelete = async (feedId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this feed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await apiService.post(`/user/userFeedDelete/${feedId}`);
        Swal.fire({
          title: 'Deleted!',
          text: 'The feed has been Deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        fetchFeeds();
      } catch (error) {
        console.error('Error Deleting feed:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error Deleting the feed.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
              className={`relative rounded-lg p-6 mb-6 shadow-lg text-gray-800 hover:shadow-xl transition-shadow duration-300 ${
                feed.user._id === userId
                  ? 'bg-white border-4 border-green-500 rounded-lg '
                  : 'bg-gradient-to-br from-white to-gray-100'
              }`}
            >
      <div className="flex items-center mb-4">
          {feed.user.profilePicture ? (
            <img
            src={feed.user.profilePicture}
            alt={`${feed.user.name}'s profile`}
            className="w-12 h-12 rounded-full mr-4 object-cover"
      />
      ) : (
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
            {feed.user.name[0]}
        </div>
       )}
        <div>
          <h3 className="font-bold text-lg">{feed.user.name}</h3>
          <p className="text-sm text-gray-500">
          {new Date(feed.createdAt).toLocaleString()}
          </p>
        </div>
      <button
        onClick={() => toggleDropdown(feed._id)}
        className="ml-auto focus:outline-none"
      >
    <FaEllipsisV />
  </button>
</div>


              {/* Dropdown menu for Edit/Delete or Report options */}
              {dropdownOpen === feed._id && (
                <div className="dropdown absolute top-12 right-4 z-10 bg-white border rounded shadow-lg p-2 w-32">
                  {feed.user._id === userId ? (
                    <>
                      <button
                        className="block w-full text-left p-2 hover:bg-gray-200"
                        onClick={() => {
                          /* handle edit */
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left p-2 hover:bg-gray-200"
                        onClick={() => handleDelete(feed._id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="block w-full text-left p-2 hover:bg-gray-200"
                      onClick={() => handleReport(feed._id)}
                    >
                      Report
                    </button>
                  )}
                </div>
              )}

              <p className="mt-2 text-lg">{feed.content}</p>
              {feed.files.map((file, index) => (
                <div key={index} className="mt-4">
                  {file.fileType.startsWith('image') ? (
                    <img
                      src={file.url}
                      alt="Feed content"
                      className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    />
                  ) : (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      <FaShare className="mr-2" /> View attached file
                    </a>
                  )}
                </div>
              ))}
              <div className="mt-6 flex justify-between items-center">
                <button className="flex items-center text-red-500 hover:text-red-700">
                  <FaHeart className="mr-1" /> Like
                </button>
                <button className="flex items-center text-blue-500 hover:text-blue-700">
                  <FaComment className="mr-1" /> Comment
                </button>
                <button className="flex items-center text-green-500 hover:text-green-700">
                  <FaShare className="mr-1" /> Share
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No feeds available</p>
        )}
      </div>
    </div>
  );
};

export default BodyFeedsUser;
