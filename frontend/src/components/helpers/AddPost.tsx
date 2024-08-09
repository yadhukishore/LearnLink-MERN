// components/AddPost.tsx
import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { AppDispatch,RootState } from '../store/store';
import { createPost } from '../../features/feeds/feedSlice'; 

const AddPost: React.FC = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      dispatch(createPost({ content, image, userId }));
      setContent('');
      setImage('');
    } else {
      console.error('User ID not found');
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 mb-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <input
          type="text"
          className="w-full p-2 mb-2 border rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;