import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface AvailableTime {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedUsers: string[];
}

interface AvailableTimesProps {
  courseId: string;
  userId: string;
}

const AvailableTimes: React.FC<AvailableTimesProps> = ({ courseId, userId }) => {
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  useEffect(() => {
    fetchAvailableTimes();
    const interval = setInterval(fetchAvailableTimes, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [courseId]);

  const fetchAvailableTimes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/available-times/${courseId}`);
      setAvailableTimes(response.data.availableTimes);
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };

  const handleToggleBooking = async (timeId: string, isCurrentlyBooked: boolean) => {
    try {
      const action = isCurrentlyBooked ? 'unbook' : 'book';
      const result = await Swal.fire({
        title: `Confirm ${action}ing`,
        text: `Are you sure you want to ${action} this call?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action} it!`
      });

      if (result.isConfirmed) {
        const endpoint = isCurrentlyBooked ? 'unschedule-call' : 'schedule-call';
        await axios.post(`http://localhost:8000/api/user/${endpoint}/${courseId}`, {
          userId,
          timeId
        });
        Swal.fire(
          `${action.charAt(0).toUpperCase() + action.slice(1)}ed!`,
          `Your call has been ${action}ed.`,
          'success'
        );
        fetchAvailableTimes();
      }
    } catch (error) {
      console.error(`Error ${isCurrentlyBooked ? 'unbooking' : 'booking'} call:`, error);
      Swal.fire(
        'Error',
        `Failed to ${isCurrentlyBooked ? 'unbook' : 'book'} the call. Please try again.`,
        'error'
      );
    }
  };

  const isTimeExpired = (endTime: string) => {
    return new Date(endTime) < new Date();
  };

  const isBookedByCurrentUser = (time: AvailableTime) => {
    return time.bookedUsers.includes(userId);
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Available Times with Tutor</h4>
      {availableTimes.length === 0 ? (
        <p>No available times.</p>
      ) : (
        <ul className="space-y-2">
          {availableTimes.map((time) => (
            <li key={time._id} className="bg-gray-700 p-2 rounded flex justify-between items-center">
              <span>
                {new Date(time.startTime).toLocaleString()} - {new Date(time.endTime).toLocaleString()}
              </span>
              {!isTimeExpired(time.endTime) && (
                <button
                  onClick={() => handleToggleBooking(time._id, isBookedByCurrentUser(time))}
                  className={`${
                    isBookedByCurrentUser(time)
                      ? 'bg-red-500 hover:bg-red-700'
                      : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold py-1 px-2 rounded text-sm`}
                >
                  {isBookedByCurrentUser(time) ? 'Unbook' : 'Book'}
                </button>
              )}
              {isBookedByCurrentUser(time) && (
                <span className="text-green-500 font-bold ml-2">Ready for call at start time</span>
              )}
              {isTimeExpired(time.endTime) && (
                <span className="text-gray-500">Expired</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableTimes;