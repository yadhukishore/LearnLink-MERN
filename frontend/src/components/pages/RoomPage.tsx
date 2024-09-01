import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const myMeetingRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let zc: ReturnType<typeof ZegoUIKitPrebuilt.create> | null = null;

    const myMeeting = async (element: HTMLDivElement) => {
      const appID =  Number(import.meta.env.VITE_ZEGO_APP_ID); 
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId!,
        Date.now().toString(),
        "User"
      );
      zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Copy Link',
            url: `${window.location.origin}/room/${roomId}`
          }
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => handleLeaveRoom(),
      });
    };

    if (myMeetingRef.current) {
      myMeeting(myMeetingRef.current);
    }

    return () => {
      if (zc) {
        zc.destroy();
      }
    };
  }, [roomId, navigate]);

  const handleLeaveRoom = async () => {
    try {
      console.log('Leaving room:', roomId);
      const cleanRoomId = roomId?.startsWith('/room/') ? roomId.slice(6) : roomId;
      const response = await axios.put(`http://localhost:8000/api/call/end/${cleanRoomId}`);
      console.log('Leave room response:', response.data);
      navigate(-1);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <h2 className="text-3xl font-bold mb-6 p-4">Video Call Room</h2>
      <div ref={myMeetingRef} className="w-full h-[calc(100vh-100px)]" />
    </div>
  );
};

export default RoomPage;