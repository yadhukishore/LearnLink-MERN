import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface CourseData {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnailFile: File | null;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseId: string;
  category: string;
  videos: {
    file: File | null;
    title: string;
    description: string;
    previewUrl: string | null;
  }[];
}


interface CourseOptionsProps {
  courseData: CourseData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setCourseData: React.Dispatch<React.SetStateAction<CourseData>>;
}

interface Category {
  _id: string;
  name: string;
}

const CourseOptions: React.FC<CourseOptionsProps> = ({ courseData, handleInputChange, setCourseData }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tutor/getAllCategoriesForTutor');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddItem = (field: 'benefits' | 'prerequisites') => {
    setCourseData((prevState) => ({
      ...prevState,
      [field]: [...prevState[field], { title: '' }],
    }));
  };

  const handleItemChange = (index: number, value: string, field: 'benefits' | 'prerequisites') => {
    setCourseData((prevState) => ({
      ...prevState,
      [field]: prevState[field].map((item, i) =>
        i === index ? { ...item, title: value } : item
      ),
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
        <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
        <select
          id="category"
          name="category"
          value={courseData.category}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </motion.div>

      {(['benefits', 'prerequisites'] as ('benefits' | 'prerequisites')[]).map((field) => (
        <motion.div key={field} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
          <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
          {Array.isArray(courseData[field]) &&
            courseData[field].map((item, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, e.target.value, field)}
                  className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field.slice(0, -1)} item`}
                />
              </div>
            ))}
          <button
            type="button"
            onClick={() => handleAddItem(field)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Add {field.slice(0, -1)}
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseOptions;
