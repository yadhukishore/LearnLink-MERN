// CourseOptions.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CourseOptionsProps {
  courseData: {
    category: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCourseData: React.Dispatch<React.SetStateAction<any>>;
}

const CourseOptions: React.FC<CourseOptionsProps> = ({ courseData, handleInputChange, setCourseData }) => {
  const handleAddItem = (field: 'benefits' | 'prerequisites') => {
    setCourseData(prevState => ({
      ...prevState,
      [field]: [...prevState[field], { title: '' }]
    }));
  };

  const handleItemChange = (index: number, value: string, field: 'benefits' | 'prerequisites') => {
    setCourseData(prevState => ({
      ...prevState,
      [field]: prevState[field].map((item, i) => 
        i === index ? { ...item, title: value } : item
      )
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
        <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={courseData.category}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>

      {['benefits', 'prerequisites'].map((field) => (
        <motion.div key={field} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
          <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
          {courseData[field as keyof typeof courseData].map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleItemChange(index, e.target.value, field as 'benefits' | 'prerequisites')}
                className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field} item`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(field as 'benefits' | 'prerequisites')}
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