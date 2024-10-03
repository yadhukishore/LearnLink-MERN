import React, { useState, useRef } from 'react';
import InfoCard from './InfoCard';
import { Link } from 'react-router-dom';
import TutorModal from './pages/TutorModal';
import { FaChalkboardTeacher, FaUsers, FaLaptop, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CgDarkMode } from 'react-icons/cg'; 
import CountUp from 'react-countup';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
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

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        isDarkTheme ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white'
      }`}
    >
      {/* Theme Toggle Button */}
      <motion.div
        className="fixed bottom-10 right-10 bg-gray-800 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-600 z-50"
        drag
        whileHover={{ scale: 1.1 }}
        onClick={toggleTheme}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <CgDarkMode size={28} />
      </motion.div>

      {/* Main container */}
      <motion.div
        className="container mx-auto px-4 py-16 text-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold mb-6">
          Join, Learn, and Create Communities You Love
        </h1>

        <motion.div
          className="flex justify-center space-x-4 mb-16"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link to='/register' className="bg-teal-400 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-green-600 transform transition hover:scale-110 shadow-lg">
            Get Started
          </Link>
          <button
            onClick={openModal}
            className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-indigo-600 transform transition hover:scale-110 shadow-lg"
          >
            Start as Tutor
          </button>
        </motion.div>

        {/* InfoCard Section */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <InfoCard title="Latest Updates" content="Stay tuned for the latest features and improvements!" />
          <InfoCard title="Special Offers" content="It will be updated soon! The Website is under construction..!" />
        </motion.div>

        
            {/* New Statistics Section */}
      <motion.div 
        className="mt-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* <h2 className="text-4xl font-bold mb-12">Our Impact</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Expert Tutors", endValue: 878, suffix: "+" },
            { title: "Hours of Content", endValue: 20132, suffix: "+" },
            { title: "Subjects & Courses", endValue: 232, suffix: "+" },
            { title: "Active Students", endValue: 72213, suffix: "+" },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className={`p-6 rounded-lg shadow-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold mb-4">{stat.title}</h3>
              <CountUp 
                end={stat.endValue} 
                duration={2.5} 
                separator="," 
                suffix={stat.suffix}
                className="text-4xl font-extrabold text-teal-400"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

        {/* Floating Service Cards */}
        <div ref={servicesRef} id="services" className="mt-32">
          <h2 className="text-4xl font-bold mb-12">Our Services</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div className={`p-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}>
              <FaChalkboardTeacher className="text-5xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-2xl font-bold mb-2">Study Here</h3>
              <p>Connect with experienced tutors in various subjects and fields.</p>
            </motion.div>

            <motion.div className={`p-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}>
              <FaUsers className="text-5xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-2xl font-bold mb-2">Build Community</h3>
              <p>Join and collaborate with peers from around the world.</p>
            </motion.div>

            <motion.div className={`p-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}>
              <FaLaptop className="text-5xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-2xl font-bold mb-2">Purchase Books</h3>
              <p>Purchase your favorite books and study materials.</p>
            </motion.div>
          </motion.div>
        </div>

        {/* About Us Section */}
        <div ref={aboutRef} id="about" className="mt-32">
          <h2 className="text-4xl font-bold mb-12">About Us</h2>
          <motion.div
            className={`flex flex-col lg:flex-row items-center justify-between rounded-xl shadow-2xl overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="lg:w-1/2 p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-4">Empowering Education</h3>
              <p className="text-lg mb-6">We believe in the power of community-driven learning and the impact of personalized tutoring.</p>
              <p className="text-lg mb-6">Our platform connects passionate educators with eager learners, creating a vibrant ecosystem.</p>
              <p className="text-lg">Join us in transforming the future of learning.</p>
            </div>
            <div className="lg:w-1/2 relative" style={{ paddingBottom: '28.25%' }}>
              <iframe
                ref={videoRef}
                src="https://www.youtube.com/embed/DAPW3dc4Pgc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
                title="LearnLink"
                className="absolute inset-0 w-full h-full rounded-lg shadow-xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
              >
                {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Contact Us Section */}
        <div ref={contactRef} id="contact" className="mt-32">
          <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
          <motion.div className={`max-w-lg mx-auto p-8 rounded-lg shadow-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-bold mb-2">
                  Name
                </label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-transparent focus:outline-none" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-bold mb-2">
                  Email
                </label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-transparent focus:outline-none" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-lg font-bold mb-2">
                  Message
                </label>
                <textarea id="message" className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-transparent focus:outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-32 py-8 border-t border-gray-400 text-center">
          <p>&copy; 2024 Your Website. All Rights Reserved.</p>
        </footer>
      </motion.div>

      <TutorModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;
