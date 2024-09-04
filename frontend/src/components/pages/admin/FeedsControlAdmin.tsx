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

interface Feed {
  _id: string;
  content: string;
  files: { url: string; fileType: string }[];
  createdAt: string;
  user: {
    name: string;
    email:string;
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


const FeedControl: React.FC = () => {
  const [normalFeeds, setNormalFeeds] = useState<Feed[]>([]);
  const [reportedFeeds, setReportedFeeds] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportedPage, setReportedPage] = useState<number>(1);
  const [normalPage, setNormalPage] = useState<number>(1);
  const [totalReportedPages, setTotalReportedPages] = useState<number>(1);
  const [totalNormalPages, setTotalNormalPages] = useState<number>(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

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

  const fetchFeeds = async (reportedPage: number, normalPage: number) => {
    setIsLoading(true);
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
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const MySwal = withReactContent(Swal);

  const handleRemovePost = async (feedId: string) => {
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
      try {
        await apiService.post(`/admin/AdminRemoveFeed/${feedId}`);
        setReportedFeeds(reportedFeeds.filter((feed) => feed._id !== feedId));
        setNormalFeeds(normalFeeds.filter((feed) => feed._id !== feedId));

        MySwal.fire('Removed!', 'The post has been removed successfully.', 'success');
      } catch (error) {
        console.error('Error removing feed:', error);
        MySwal.fire('Error!', 'There was a problem removing the post.', 'error');
      }
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderFeedSection = (feedList: Feed[], title: string) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-purple-500 pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedList.map((feed) => (
          <div
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
              <button
                onClick={() => handleRemovePost(feed._id)}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center mt-2 hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="mr-2" />
                <span>Remove Post</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <h1 className="text-4xl font-bold mb-8 text-gray-500 text-center">Feed Control</h1>
          <div className="max-w-7xl mx-auto">
            {renderFeedSection(reportedFeeds, "Reported Feeds")}
            <Pagination
              currentPage={reportedPage}
              totalPages={totalReportedPages}
              onPageChange={setReportedPage}
              className="my-4"
            />
            {renderFeedSection(normalFeeds, "Normal Feeds")}
            <Pagination
              currentPage={normalPage}
              totalPages={totalNormalPages}
              onPageChange={setNormalPage}
              className="my-4"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedControl;