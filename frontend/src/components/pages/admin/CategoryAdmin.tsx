// src/components/admin/AdminCategory.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { checkAdminAuthStatus } from '../../../features/admin/adminSlice';
import { RootState } from '../../store/store';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaFolder, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Pagination } from 'flowbite-react'; 

interface Category {
  _id: string;
  name: string;
  courseCount: number;
}

const AdminCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      fetchCategories(currentPage); 
    }
  }, [isAuthenticated, navigate, currentPage]);

  const fetchCategories = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiService.get<{ categories: Category[], totalPages: number }>(
        '/admin/adminCoursesCategory',
        { params: { page, limit: 6 } }
      );
      setCategories(response.categories);
      setTotalPages(response.totalPages);
    }  catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      await apiService.post('/admin/adminCoursesCategory', { name: newCategoryName });
      setNewCategoryName('');
      setIsAddingCategory(false);
      fetchCategories(currentPage);
      Swal.fire('Success', 'Category added successfully', 'success');
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire('Error', error.message || 'Error adding category', 'error');
      } else {
        Swal.fire('Error', 'An unexpected error occurred', 'error');
      }
    }
  };

  const handleEditCategory = (categoryId: string, currentName: string) => {
    Swal.fire({
      title: 'Edit Category',
      input: 'text',
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: (newName) => {
        if (newName && newName !== currentName) {
          return apiService.put(`/admin/adminEditCoursesCategory/${categoryId}`, { name: newName })
            .then(response => {
              fetchCategories(currentPage);
              return response;
            })
            .catch(error => {
              if (error instanceof Error) {
                Swal.showValidationMessage(error.message || 'Error updating category');
              } else {
                Swal.showValidationMessage('An unexpected error occurred');
              }
            });
        } else if (newName === currentName) {
          Swal.showValidationMessage('New name must be different from the current name');
        } else {
          Swal.showValidationMessage('Category name cannot be empty');
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success', 'Category updated successfully', 'success');
      }
    });
  };


  const handleDeleteCategory = (categoryId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        apiService.delete(`/admin/adminCoursesCategory/${categoryId}`)
          .then(() => {
            fetchCategories(currentPage);
            Swal.fire('Deleted!', 'The category has been deleted.', 'success');
          })
          .catch(error => {
            Swal.fire('Error!', 'There was a problem deleting the category.', error);
          });
      }
    });
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return null; // Later add a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Course Categories</h1>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Category
            </button>
          </div>

          {isAddingCategory && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="border p-2 mr-2 w-full md:w-1/2"
                placeholder="Enter category name"
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2 md:mt-0"
              >
                Save Category
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id || category.name}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaFolder className="mr-2" />
                      <p>{category.courseCount} {category.courseCount === 1 ? 'Course' : 'Courses'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-200 p-2 flex justify-around">
                    <button
                      onClick={() => handleEditCategory(category._id, category.name)}
                      className={`text-blue-500 hover:text-blue-700 ${category.courseCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={category.courseCount > 0}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className={`text-red-500 hover:text-red-700 ${category.courseCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={category.courseCount > 0}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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
    </div>
  );
};

export default AdminCategory;
