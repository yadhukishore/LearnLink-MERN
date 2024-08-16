// CourseInformation.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CourseInformationProps {
  courseData: {
    name: string;
    price: number;
    estimatedPrice: number;
    tags: string;
    level: string;
    demoUrl: string;
    description: string;
    thumbnailFile: File | null;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleArrayInputChange?: (field: string, index: number, value: string) => void;
  handleAddField?: (field: string) => void;
  handleRemoveField?: (field: string, index: number) => void;
}

const CourseInformation: React.FC<CourseInformationProps> = ({
  courseData,
  handleInputChange,
  handleFileChange
}) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="name" className="block text-sm font-medium mb-2">Course Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={courseData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="price" className="block text-sm font-medium mb-2">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={courseData.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="estimatedPrice" className="block text-sm font-medium mb-2">Estimated Price</label>
        <input
          type="number"
          id="estimatedPrice"
          name="estimatedPrice"
          value={courseData.estimatedPrice}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={courseData.tags}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="level" className="block text-sm font-medium mb-2">Level</label>
        <input
          type="text"
          id="level"
          name="level"
          value={courseData.level}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="demoUrl" className="block text-sm font-medium mb-2">Demo URL</label>
        <input
          type="text"
          id="demoUrl"
          name="demoUrl"
          value={courseData.demoUrl}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>
    </div>

    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
      <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
      <textarea
        id="description"
        name="description"
        value={courseData.description}
        onChange={handleInputChange}
        required
        rows={4}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </motion.div>
    {/* Thumbnail Upload */}
    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
        <label htmlFor="thumbnailFile" className="block text-sm font-medium mb-2">Upload Thumbnail</label>
        <input
          type="file"
          id="thumbnailFile"
          name="thumbnailFile"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {courseData.thumbnailFile && (
          <div className="mt-2">
            <img 
              src={URL.createObjectURL(courseData.thumbnailFile)} 
              alt="Thumbnail Preview" 
              className="w-32 h-1/3 object-cover rounded-md"
            />
          </div>
        )}
      </motion.div>
    </div>

);

export default CourseInformation;
