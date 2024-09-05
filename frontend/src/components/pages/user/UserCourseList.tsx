// src/components/user/UserCourseList.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { motion } from 'framer-motion';
import Header from './HeaderUser';
import CurrentLearningCourses from './CurrentLearningCourses';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { addToWishlist, removeFromWishlist, setWishlist } from '../../../features/wishlist/wishlistSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Pagination } from 'flowbite-react';
import SearchButton from '../../helpers/SearchButtonUser';

interface Course {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  estimatedPrice: number;
  level: string;
  category: string;
}

interface CurrentCourse extends Course {
  progress: number;
}

interface CoursesResponse {
  courses: Course[];
  totalPages: number;
}

interface CurrentCoursesResponse {
  currentCourses: CurrentCourse[];
}

interface WishlistResponse {
  wishlist: Course[];
}

const UserCourseList: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourses, setCurrentCourses] = useState<CurrentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const coursesPerPage = 6; 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allCoursesResponse, currentCoursesResponse] = await Promise.all([
          apiService.get<CoursesResponse>(`/user/courses`, {
            params: { page: currentPage, limit: coursesPerPage,sort:sortOrder },
          }),
          apiService.get<CurrentCoursesResponse>(`/user/current-courses`, {
            params: { userId: user?.id },
          }),
        ]);

        setCourses(allCoursesResponse.courses);
        setTotalPages(allCoursesResponse.totalPages);
        setCurrentCourses(currentCoursesResponse.currentCourses);

        if (user?.id) {
          const wishlistResponse = await apiService.get<WishlistResponse>(`/user/wishlist/${user.id}`);
          dispatch(setWishlist(wishlistResponse.wishlist));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses or wishlist:', error);
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchCourses();
    }
  }, [user, dispatch, currentPage,sortOrder]);

  const handleWishlistToggle = useCallback(async (course: Course) => {
    const isWishlisted = wishlist.some(item => item._id === course._id);

    try {
      const url = isWishlisted ? '/user/wishlist/remove' : '/user/wishlist/add';
      await apiService.post(url, {
        userId: user?.id,
        courseId: course._id,
      });
      dispatch(isWishlisted ? removeFromWishlist(course._id) : addToWishlist(course));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  }, [wishlist, user, dispatch]);

  const onPageChange = (page: number) => {
    setCurrentPage(page); 
  };
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as 'asc' | 'desc');
  };

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
      <SearchButton />
        <CurrentLearningCourses courses={currentCourses} />
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Explore Our Courses
          </span>
        </h1>
        <div className="flex justify-end mb-4">
          <label htmlFor="sortOrder" className="mr-2 text-gray-300">Sort by Price:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const discount = course.estimatedPrice
              ? Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)
              : 0;

            const isWishlisted = wishlist.some(item => item._id === course._id);

            return (
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
                  <p className="text-sm text-gray-300 mb-4 flex-grow">{course.category}</p>
                  <div className="flex justify-start items-center mb-4">
                    <span className="text-lg font-bold text-yellow-400">₹{course.price.toFixed(2)}</span>
                    {course.estimatedPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{course.estimatedPrice.toFixed(2)}</span>
                    )}
                    {discount > 0 && (
                      <span className="text-sm font-semibold text-red-400 ml-4">{discount}% Off</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <Link 
                      to={`/courses/${course._id}`} 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleWishlistToggle(course)}
                      className="ml-4 text-pink-500 hover:text-pink-600 transition duration-300"
                      aria-label="Toggle Wishlist"
                    >
                      {isWishlisted ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination Component */}
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default UserCourseList;
