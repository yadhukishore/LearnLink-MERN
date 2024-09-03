import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setWishlist, removeFromWishlist } from '../../../features/wishlist/wishlistSlice';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from './HeaderUser';

const UserWishlist: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/wishlist/${user?.id}`);
        dispatch(setWishlist(response.data.wishlist));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchWishlist();
    }
  }, [user, dispatch]);

  const handleRemove = useCallback(async (courseId: string) => {
    try {
      await axios.post('http://localhost:8000/api/user/wishlist/remove', {
        userId: user?.id,
        courseId,
      });
      dispatch(removeFromWishlist(courseId));
    } catch (error) {
      console.error('Error removing course from wishlist:', error);
    }
  }, [user, dispatch]);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
    <Header /> 
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
          Your Wishlist
        </span>
      </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.length === 0 ? (
            <p className="text-center text-gray-400">Your wishlist is empty.</p>
          ) : (
            wishlist.map((course, index) => (
              <motion.div
                key={course._id}
                className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gray-900 p-4 rounded-lg h-full flex flex-col">
                  <img src={course.thumbnail.url} alt={course.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-yellow-400">₹{course.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleRemove(course._id)}
                      className="text-red-500 hover:text-red-600 transition duration-300"
                      aria-label="Remove from Wishlist"
                    >
                      <FaHeart size={24} />
                    </button>
                  </div>
                  <Link 
                    to={`/courses/${course._id}`} 
                    className="bg-blue-500 mt-4 text-white text-center px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default UserWishlist;
