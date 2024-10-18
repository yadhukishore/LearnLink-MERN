import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAdminAuthStatus } from '../../../features/admin/adminSlice';
import { RootState } from '../../store/store';
import Sidebar from './Sidebar';
import Header from './Header';

import { apiService } from '../../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDropzone } from 'react-dropzone';

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'latest_update' | 'special_offer';
}

const AdminShowEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: '', description: '', type: 'latest_update' });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    dispatch(checkAdminAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    } else {
      fetchEvents();
    }
  }, [isAuthenticated, navigate]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<Event[]>('/admin/events');
      setEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
      MySwal.fire('Error!', 'Failed to fetch events.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('title', editingEvent?.title || newEvent.title || '');
      formData.append('description', editingEvent?.description || newEvent.description || '');
      formData.append('type', editingEvent?.type || newEvent.type || 'latest_update');
  
      if (editingEvent) {
        await apiService.put(`/admin/events/${editingEvent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        MySwal.fire('Updated!', 'The event has been updated successfully.', 'success');
      } else {
        await apiService.post('/admin/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        MySwal.fire('Added!', 'The new event has been added successfully.', 'success');
      }
      fetchEvents();
      setNewEvent({ title: '', description: '', type: 'latest_update' });
      setEditingEvent(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error saving event:', error);
      MySwal.fire('Error!', 'Failed to save the event.', 'error');
    }
  };
  

  const onDrop = (acceptedFiles: File[]) => {
    setImageFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] } 
  });
  

  const handleDelete = async (id: string) => {
    try {
      await apiService.delete(`/admin/events/${id}`);
      MySwal.fire('Deleted!', 'The event has been deleted successfully.', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      MySwal.fire('Error!', 'Failed to delete the event.', 'error');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({ title: event.title, description: event.description, type: event.type });
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

  const latestUpdates = events.filter(event => event.type === 'latest_update');
  const specialOffers = events.filter(event => event.type === 'special_offer');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Manage Events</h1>
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="mb-8">
  <input
    type="text"
    name="title"
    value={editingEvent ? editingEvent.title : newEvent.title}
    onChange={handleInputChange}
    placeholder="Title"
    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    required
  />
  <textarea
    name="description"
    value={editingEvent ? editingEvent.description : newEvent.description}
    onChange={handleInputChange}
    placeholder="Description"
    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    required
  />
  {/* The Dropzone component for image file upload */}
  <div {...getRootProps()} className="w-full p-6 mb-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none">
    <input {...getInputProps()} />
    {imageFile ? (
      <p>{imageFile.name}</p>
    ) : (
      <p>Drag & drop an image here, or click to select one</p>
    )}
  </div>
  <select
    name="type"
    value={editingEvent ? editingEvent.type : newEvent.type}
    onChange={handleInputChange}
    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    required
  >
    <option value="latest_update">Latest Update</option>
    <option value="special_offer">Special Offer</option>
  </select>
  <button type="submit" className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition duration-300">
    {editingEvent ? 'Update Event' : 'Add Event'}
  </button>
</form>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Latest Updates</h2>
              {latestUpdates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {latestUpdates.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover rounded mb-2" />
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(event)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                        <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No latest updates added.</p>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Special Offers</h2>
              {specialOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specialOffers.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover rounded mb-2" />
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(event)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                        <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No special offers added.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminShowEvents;