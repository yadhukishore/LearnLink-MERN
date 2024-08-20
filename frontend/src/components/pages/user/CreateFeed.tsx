import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FiImage, FiSend } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface CreateFeedProps {
  onFeedCreated: () => void;
}

const CreateFeed: React.FC<CreateFeedProps> = ({ onFeedCreated }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content && files.length === 0) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to post this content?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, post it!',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Posting...',
          text: 'Finishing your Post...Please wait.!.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); 
          },
        });

        const formData = new FormData();
        formData.append('content', content);
        files.forEach((file) => formData.append('files', file));
        formData.append('userId', user?.id);

        try {
          await axios.post('http://localhost:8000/api/user/feeds', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setContent('');
          setFiles([]);
          setPreviewUrls([]);
          onFeedCreated();
          Swal.fire('Posted!', 'Your content has been posted.', 'success');
        } catch (error) {
          console.error('Error creating feed:', error);
          Swal.fire('Error!', 'There was an error posting your content.', 'error');
        }
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-[#0A1E32] rounded-lg p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <img
          src={user?.profilePicture || 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-grey-photo-placeholder-illustrations-vectors-default-avatar-profile-icon-grey-photo-placeholder-99724602.jpg'}
          alt="User"
          className="w-10 h-10 rounded-full mr-3"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-grow bg-[#071A2B] text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {previewUrls.map((url, index) => (
            <img key={index} src={url} alt="Preview" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="cursor-pointer flex items-center text-blue-400 hover:text-blue-500 transition-colors">
          <FiImage className="mr-2" />
          Add Image
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center transition-colors"
          disabled={!content && files.length === 0}
        >
          Post <FiSend className="ml-2" />
        </button>
      </div>
    </form>
  );
};

export default CreateFeed;
