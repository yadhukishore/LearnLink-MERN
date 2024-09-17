// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import io from 'socket.io-client';
// import { RootState } from '../../store/store';

// const socket = io('http://localhost:8000');

// const UserChatWithTutor: React.FC = () => {
//   const [messages, setMessages] = useState<Array<{ sender: string; message: string }>>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const { tutorId } = useParams<{ tutorId: string }>();
//   const user = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     if (user && tutorId) {
//       const roomId = `${user.id}-${tutorId}`;
//       console.log(`User joining room: ${roomId}`);
//       socket.emit('join_room', roomId);

//       socket.on('receive_message', (data) => {
//         setMessages((prevMessages) => [...prevMessages, data]);
//       });
//     }

//     return () => {
//       socket.off('receive_message');
//     };
//   }, [user, tutorId]);

//   const sendMessage = () => {
//     if (inputMessage.trim() && user && tutorId) {
//       const messageData = {
//         room: `${user.id}-${tutorId}`,
//         sender: user.name,
//         message: inputMessage,
//       };

//       socket.emit('send_message', messageData);
//       setMessages((prevMessages) => [...prevMessages, messageData]);
//       setInputMessage('');
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, index) => (
//           <div key={index} className={`mb-2 ${msg.sender === user?.name ? 'text-right' : 'text-left'}`}>
//             <span className="inline-block bg-blue-500 text-white rounded px-2 py-1">
//               {msg.message}
//             </span>
//           </div>
//         ))}
//       </div>
//       <div className="bg-white p-4">
//         <div className="flex">
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             className="flex-1 border rounded-l px-2 py-1"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-500 text-white rounded-r px-4 py-1"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserChatWithTutor;