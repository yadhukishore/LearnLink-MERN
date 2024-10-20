import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TutorModal from './pages/TutorModal';
import { FaChalkboardTeacher, FaUsers, FaLaptop, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import StatisticsSection from './landingPageHelper/StatisticsSection';
import SpecialOffersSection from './landingPageHelper/SpecialOffers';
import ThemeToggleButton from './landingPageHelper/ThemeToggleButton';
import LatestUpdatesSection from './landingPageHelper/LandingUpfateSection';
import Footer from './landingPageHelper/FooterLanding';

interface SpecialOffer {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface LatestUpdate {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}


const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdate[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchSpecialOffers();
    fetchLatestUpdates();
  }, []);
  const fetchSpecialOffers = async () => {
    try {
      const response = await apiService.get<{ specialOffers: SpecialOffer[] }>('/admin/special-offers');
      setSpecialOffers(response.specialOffers);
    } catch (error) {
      console.error('Error fetching special offers:', error);
    }
  };
  const fetchLatestUpdates = async () => {
    try {
      const response = await apiService.get<{ latestUpdate: LatestUpdate[] }>('/admin/latest_update');
      setLatestUpdates(response.latestUpdate);
    } catch (error) {
      console.error('Error fetching latest updates:', error);
    }
  };

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

  const nextOffer = () => {
    setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % specialOffers.length);
  };

  const prevOffer = () => {
    setCurrentOfferIndex((prevIndex) => (prevIndex - 1 + specialOffers.length) % specialOffers.length);
  };

  const nextUpdate = () => {
    setCurrentUpdateIndex((prevIndex) => (prevIndex + 1) % latestUpdates.length);
  };

  const prevUpdate = () => {
    setCurrentUpdateIndex((prevIndex) => (prevIndex - 1 + latestUpdates.length) % latestUpdates.length);
  };

  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        isDarkTheme ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white'
      }`}
    >
       <ThemeToggleButton toggleTheme={toggleTheme} />
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

    {/* New Statistics Section */}
    <StatisticsSection isDarkTheme={isDarkTheme} />

    {/* Updated Latest Updates and Special Offers Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <LatestUpdatesSection
            latestUpdates={latestUpdates}
            currentUpdateIndex={currentUpdateIndex}
            nextUpdate={nextUpdate}
            prevUpdate={prevUpdate}
            isDarkTheme={isDarkTheme}
          />
          <SpecialOffersSection
            specialOffers={specialOffers}
            currentOfferIndex={currentOfferIndex}
            nextOffer={nextOffer}
            prevOffer={prevOffer}
            isDarkTheme={isDarkTheme}
          />
        </div>
        
 

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
    <Footer />
      </motion.div>

      <TutorModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;
