// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { RootState } from '../../store/store';

// const socket = io('http://localhost:8000');

// interface ChatUser {
//   id: string;
//   name: string;
// }

// interface Message {
//   sender: string;
//   message: string;
// }

// const TutorChat: React.FC = () => {
//   const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const tutor = useSelector((state: RootState) => state.tutor.tutor);

//   useEffect(() => {
//     if (tutor) {
//       const fetchChatUsers = async () => {
//         try {
//           const response = await axios.get(`http://localhost:8000/api/tutor/chat-users/${tutor.id}`);
//           setChatUsers(response.data);
//         } catch (error) {
//           console.error('Failed to fetch chat users:', error);
//         }
//       };

//       fetchChatUsers();

//       socket.on('receive_message', (data: Message) => {
//         console.log('Tutor received message:', data);
//         setMessages(prevMessages => [...prevMessages, data]);
//       });
//     }

//     return () => {
//       socket.off('receive_message');
//     };
//   }, [tutor]);

//   useEffect(() => {
//     if (selectedUser && tutor) {
//       const roomId = `${selectedUser.id}-${tutor.id}`;
//       socket.emit('join_room', roomId);
      
//       const fetchChatHistory = async () => {
//         try {
//           console.log(`Tutor ${tutor} and user ${selectedUser.id}`)
//           const response = await axios.get(`http://localhost:8000/api/tutor/chat-history/${tutor.id}/${selectedUser.id}`);
//           setMessages(response.data);
//         } catch (error) {
//           console.error('Failed to fetch chat history:', error);
//         }
//       };

//       fetchChatHistory();
//     }
//   }, [selectedUser, tutor]);

//   const selectUser = (user: ChatUser) => {
//     setSelectedUser(user);
//     setMessages([]);
//   };

//   const sendMessage = () => {
//     if (inputMessage.trim() && tutor && selectedUser) {
//       const messageData = {
//         room: `${selectedUser.id}-${tutor.id}`,
//         sender: tutor.name,
//         message: inputMessage,
//       };
//       socket.emit('send_message', messageData);
//       setMessages(prevMessages => [...prevMessages, messageData]);
//       setInputMessage('');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="w-1/4 bg-white border-r">
//         <h2 className="text-xl font-bold p-4">Chat Users</h2>
//         {chatUsers.map(user => (
//           <div
//             key={user.id}
//             onClick={() => selectUser(user)}
//             className={`p-2 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//           >
//             {user.name}
//           </div>
//         ))}
//       </div>
//       <div className="flex-1 flex flex-col">
//         {selectedUser ? (
//           <>
//             <div className="bg-white p-4 border-b">
//               <h2 className="text-xl font-bold">{selectedUser.name}</h2>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               {messages.map((msg, index) => (
//                 <div key={index} className={`mb-2 ${msg.sender === tutor?.name ? 'text-right' : 'text-left'}`}>
//                   <span className="inline-block bg-blue-500 text-white rounded px-2 py-1">
//                     {msg.message}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div className="bg-white p-4">
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   className="flex-1 border rounded-l px-2 py-1"
//                   placeholder="Type a message..."
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="bg-blue-500 text-white rounded-r px-4 py-1"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-xl text-gray-500">Select a user to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TutorChat;