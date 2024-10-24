import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { checkAdminAuthStatus } from '../../../features/admin/adminSlice';
import { RootState } from '../../store/store';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaUser, FaCalendarAlt, FaExclamationTriangle, FaTrash, FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Pagination } from 'flowbite-react';
import { motion } from 'framer-motion';

interface Feed {
  _id: string;
  content: string;
  files: { url: string; fileType: string }[];
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  isReported: boolean;
  isDeleted: boolean;
}

interface FeedsResponse {
  reportedFeeds: Feed[];
  normalFeeds: Feed[];
  totalReportedPages: number;
  totalNormalPages: number;
}

const MySwal = withReactContent(Swal);

const FeedControl: React.FC = () => {
  const [normalFeeds, setNormalFeeds] = useState<Feed[]>([]);
  const [reportedFeeds, setReportedFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportedPage, setReportedPage] = useState<number>(1);
  const [normalPage, setNormalPage] = useState<number>(1);
  const [totalReportedPages, setTotalReportedPages] = useState<number>(1);
  const [totalNormalPages, setTotalNormalPages] = useState<number>(1);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

  const fetchFeeds = async (reportedPage: number, normalPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get<FeedsResponse>('/admin/adminFeedControl', {
        params: {
          reportedPage,
          normalPage,
          reportedLimit: 3,
          normalLimit: 6,
        },
      });
      setReportedFeeds(response.reportedFeeds);
      setNormalFeeds(response.normalFeeds);
      setTotalReportedPages(response.totalReportedPages);
      setTotalNormalPages(response.totalNormalPages);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching feeds');
      MySwal.fire('Error!', 'Failed to fetch feeds', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(checkAdminAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    } else {
      fetchFeeds(reportedPage, normalPage);
    }
  }, [isAuthenticated, navigate, reportedPage, normalPage]);

  const handleRemovePost = async (feedId: string) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: "Hey Admin! Do you really want to remove this post?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await apiService.post(`/admin/AdminRemoveFeed/${feedId}`);
        
        setReportedFeeds(prev => prev.filter(feed => feed._id !== feedId));
        setNormalFeeds(prev => prev.filter(feed => feed._id !== feedId));
        
        await MySwal.fire('Removed!', 'The post has been removed successfully.', 'success');
        
        fetchFeeds(reportedPage, normalPage);
      }
    } catch (error: any) {
      console.error('Error removing feed:', error);
      MySwal.fire('Error!', 'There was a problem removing the post.', 'error');
    }
  };

  const renderFeedCard = (feed: Feed) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={feed._id}
      className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
    >
      {feed.files.length > 0 && feed.files[0].fileType.startsWith('image') ? (
        <div className="relative h-48">
          <img
            src={feed.files[0].url}
            alt="Feed content"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 bg-purple-500 text-white p-2 rounded-bl-lg">
            <FaImage className="text-lg" />
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
          <p className="text-white text-xl font-semibold">No Image Uploaded</p>
        </div>
      )}
      <div className="p-6">
        <p className="text-gray-800 mb-4 text-lg">{feed.content}</p>
        <div className="flex items-center text-gray-600 mb-2">
          <FaUser className="mr-2 text-purple-500" />
          <p className="font-medium">{feed.user.name}</p>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          <p>{new Date(feed.createdAt).toLocaleDateString()}</p>
        </div>
        {feed.isReported && (
          <div className="flex items-center text-red-500 mb-4 bg-red-100 p-2 rounded">
            <FaExclamationTriangle className="mr-2" />
            <p className="font-semibold">Reported</p>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRemovePost(feed._id)}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center mt-2 hover:bg-red-600 transition duration-300"
        >
          <FaTrash className="mr-2" />
          <span>Remove Post</span>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderFeedSection = (feedList: Feed[], title: string) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-purple-500 pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedList.map(renderFeedCard)}
      </div>
    </motion.div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden mb-8"
            >
              <div className="p-6 bg-purple-800 text-white">
                <h1 className="text-3xl font-bold">Feed Control</h1>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center p-4">{error}</div>
                ) : (
                  <>
                    {renderFeedSection(reportedFeeds, "Reported Feeds")}
                    <div className="flex justify-center mt-4 mb-8">
                      <Pagination
                        currentPage={reportedPage}
                        totalPages={totalReportedPages}
                        onPageChange={setReportedPage}
                      />
                    </div>
                    
                    {renderFeedSection(normalFeeds, "Normal Feeds")}
                    <div className="flex justify-center mt-4">
                      <Pagination
                        currentPage={normalPage}
                        totalPages={totalNormalPages}
                        onPageChange={setNormalPage}
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedControl;