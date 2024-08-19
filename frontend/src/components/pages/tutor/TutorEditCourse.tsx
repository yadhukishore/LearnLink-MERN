// TutorEditCourse.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TutorHeader from './TutorHeader';
import Swal from 'sweetalert2';

interface ICourse {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  estimatedPrice?: number;
  level: string;
  videos: Array<{
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
  }>;
}

const TutorEditCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.tutor.token);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tutor/tutorCourseDetail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(response.data.course);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to fetch course details');
        setLoading(false);
      }
    };

    if (token && id) {
      fetchCourse();
    }
  }, [token, id]);

  const handleEdit = async (field: string, value: string | number) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/tutor/updateCourse/${id}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourse(response.data.course);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `${field} has been updated successfully.`,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Failed to update ${field}\n ${err}`,
      });
    }
  };

  const handleVideoEdit = async (videoId: string, field: string, value: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/tutor/updateCourseVideo/${id}/${videoId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourse(response.data.course);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Video ${field} has been updated successfully.`,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Failed to update video ${field}`,
      });
    }
  };

  const handleAddVideo = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: 'Add New Video',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Video Title">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Video Description">' +
          '<input id="swal-input3" type="file" class="swal2-file" accept="video/*">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            (document.getElementById('swal-input1') as HTMLInputElement).value,
            (document.getElementById('swal-input2') as HTMLInputElement).value,
            (document.getElementById('swal-input3') as HTMLInputElement).files?.[0]
          ]
        }
      });
  
      if (formValues) {
        const [title, description, file] = formValues;
        if (!title || !description || !file) {
          Swal.fire('Error', 'Please fill all fields', 'error');
          return;
        }
  
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', file);
  
        const response = await axios.post(
          `http://localhost:8000/api/tutor/addCourseVideo/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(response.data.course);
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'New video has been added successfully.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add new video',
      });
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:8000/api/tutor/deleteCourseVideo/${id}/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(response.data.course);
        Swal.fire('Deleted!', 'Your video has been deleted.', 'success');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete video',
      });
    }
  };

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div>{error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <TutorHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Edit Course: {course.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => setCourse({ ...course, name: e.target.value })}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                <button
                  onClick={() => handleEdit('name', course.name)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <div className="flex items-center">
                <textarea
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                <button
                  onClick={() => handleEdit('description', course.description)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Price</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                <button
                  onClick={() => handleEdit('price', course.price)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Estimated Price</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={course.estimatedPrice || ''}
                  onChange={(e) => setCourse({ ...course, estimatedPrice: parseFloat(e.target.value) })}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                <button
                  onClick={() => handleEdit('estimatedPrice', course.estimatedPrice || 0)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Level</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={course.level}
                  onChange={(e) => setCourse({ ...course, level: e.target.value })}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                <button
                  onClick={() => handleEdit('level', course.level)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Thumbnail</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={course.thumbnail.url}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      thumbnail: { ...course.thumbnail, url: e.target.value },
                    })
                  }
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                <button
                  onClick={() => handleEdit('thumbnail.url', course.thumbnail.url)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            <button
              onClick={handleAddVideo}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Add New Video
            </button>
            {course.videos.map((video) => (
              <div key={video._id} className="mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl">{video.title}</h3>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
                <div className="mb-2">
                  <label className="block mb-2">Title</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          videos: course.videos.map((v) =>
                            v._id === video._id ? { ...v, title: e.target.value } : v
                          ),
                        })
                      }
                      className="bg-gray-700 text-white p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleVideoEdit(video._id, 'title', video.title)}
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block mb-2">Description</label>
                  <div className="flex items-center">
                    <textarea
                      value={video.description}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          videos: course.videos.map((v) =>
                            v._id === video._id ? { ...v, description: e.target.value } : v
                          ),
                        })
                      }
                      className="bg-gray-700 text-white p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleVideoEdit(video._id, 'description', video.description)}
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block mb-2">Video URL</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={video.videoUrl}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          videos: course.videos.map((v) =>
                            v._id === video._id ? { ...v, videoUrl: e.target.value } : v
                          ),
                        })
                      }
                      className="bg-gray-700 text-white p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleVideoEdit(video._id, 'videoUrl', video.videoUrl)}
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorEditCourse;
