import React, { useState, useRef } from 'react';
import InfoCard from './InfoCard';
import { Link } from 'react-router-dom';
import TutorModal from './pages/TutorModal';
import { FaChalkboardTeacher, FaUsers, FaLaptop, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMute = () => {
    if (videoRef.current && videoRef.current.contentWindow) {
      videoRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: isMuted ? 'unMute' : 'mute' }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Join, learn and create communities you love</h1>
        
        <div className="flex justify-center space-x-4 mb-16">
          <Link to='/register' className="bg-teal-400 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-green-600 transform transition duration-300 hover:scale-105">
            Get Started
          </Link>
          
          <button
            onClick={openModal}
            className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-indigo-600 transform transition duration-300 hover:scale-105"
          >
            Start as Tutor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <InfoCard 
            title="Latest Updates" 
            content="Stay tuned for the latest features and improvements. We're constantly working to enhance your experience!"
          />
          <InfoCard 
            title="Special Offers" 
            content="It will be updated soon! The Website is under construction..!" 
          />
        </div>

        <div ref={servicesRef} id="services" className="mt-32 text-white">
          <h2 className="text-4xl font-bold mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-xl transform transition duration-300 hover:scale-105">
              <FaChalkboardTeacher className="text-5xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-2xl font-bold mb-2">Study here</h3>
              <p>Connect with experienced tutors in various subjects and fields.</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-xl transform transition duration-300 hover:scale-105">
              <FaUsers className="text-5xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-2xl font-bold mb-2">Build Community</h3>
              <p>Join and Post yours feeds, thoughts, achivements and collaborate with peers from around the world.</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-xl transform transition duration-300 hover:scale-105">
              <FaLaptop className="text-5xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-2xl font-bold mb-2">Purchase Books</h3>
              <p>Purcahse our favorate books and your study materials.</p>
            </div>
          </div>
        </div>
        
        <div ref={aboutRef} id="about" className="mt-32 text-white">
        <h2 className="text-4xl font-bold mb-12">About Us</h2>
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white bg-opacity-10 rounded-xl overflow-hidden shadow-2xl">
          <div className="lg:w-1/2 p-8 lg:p-12">
            <h3 className="text-2xl font-bold mb-4">Empowering Education</h3>
            <p className="text-lg mb-6">
              LearnLink is revolutionizing the way we approach education. We believe in the power of community-driven learning and the impact of personalized tutoring.
            </p>
            <p className="text-lg mb-6">
              Our platform connects passionate educators with eager learners, creating a vibrant ecosystem where knowledge flows freely and learning never stops.
            </p>
            <p className="text-lg">
              Join us in our mission to make quality education accessible to everyone, anywhere in the world. Together, we can transform the future of learning.
            </p>
          </div>
          <div className="lg:w-1/2 relative" style={{ paddingBottom: '28.25%' }}>
            <iframe 
              ref={videoRef}
              src="https://www.youtube.com/embed/DAPW3dc4Pgc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
              title="LernLink ads1"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          
            <button 
              onClick={toggleMute} 
              className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
            >
            
              {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
            </button>
          </div>
        </div>
      </div>

        <div ref={contactRef} id="contact" className="mt-32 text-white">
          <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
          <div className="max-w-lg mx-auto bg-white bg-opacity-10 p-8 rounded-lg shadow-xl">
            <form>
              <div className="mb-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="mb-4">
                <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="mb-4">
                <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"></textarea>
              </div>
              <button type="submit" className="w-full bg-teal-400 text-white font-bold py-2 px-4 rounded hover:bg-teal-500 transition duration-300">Send Message</button>
            </form>
          </div>
        </div>
      </div>

      <TutorModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;