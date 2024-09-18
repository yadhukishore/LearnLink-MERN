import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiService } from '../../../../services/api';

interface LoginData {
  date: string;
  count: number;
}

const UserLoginGraph: React.FC = () => {
  const [data, setData] = useState<LoginData[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize] = useState(4); 

  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await apiService.get<{ _id: string; count: number }[]>('/admin/user-login-data');
        console.log("UserLogin response: ", response);
        
        const formattedData = response.map(item => ({
          date: item._id,
          count: item.count,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching login data:', error);
      }
    };

    fetchLoginData();
  }, []);

  const handleNext = () => {
    if (startIndex + pageSize < data.length) {
      setStartIndex(startIndex + pageSize);
    }
  };

  const handlePrev = () => {
    if (startIndex - pageSize >= 0) {
      setStartIndex(startIndex - pageSize);
    }
  };
  const displayedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">New Users Logged</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={displayedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={startIndex === 0}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${startIndex + pageSize >= data.length ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={startIndex + pageSize >= data.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserLoginGraph;
