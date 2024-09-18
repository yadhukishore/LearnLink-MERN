import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiService } from '../../../../services/api';

interface EnrollmentData {
  date: string;
  count: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const StudentsEnrollments: React.FC = () => {
  const [data, setData] = useState<EnrollmentData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [enrolledUsers, setEnrolledUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchEnrollmentData();
  }, [selectedMonth, selectedYear]);

  const fetchEnrollmentData = async () => {
    try {
      const response = await apiService.get< EnrollmentData[]>(`/admin/student-enrollments?month=${selectedMonth}&year=${selectedYear}`);
      setData(response);
    } catch (error) {
      console.error('Error fetching student enrollments data:', error);
    }
  };

  const fetchEnrolledUsers = async () => {
    try {
      const response = await apiService.get<User[]>(`/admin/enrolled-users?month=${selectedMonth}&year=${selectedYear}`);
      setEnrolledUsers(response);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching enrolled users:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Student Enrollments by Week/Date</h2>
      <div className="flex space-x-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded p-2"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded p-2"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={fetchEnrolledUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Enrolled Users
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Enrolled Users</h3>
            <ul className="max-h-60 overflow-y-auto">
              {enrolledUsers.map((user) => (
                <li key={user.id} className="mb-2">
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsEnrollments;
