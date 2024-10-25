import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TutorLoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#071A2B] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md w-full bg-[#0f2942] p-8 rounded-2xl shadow-2xl"
      >
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          src="/PinkHat.png"
          alt="LearnLink Logo"
          className="w-32 h-32 mx-auto mb-6 rounded-xl"
        />
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"
        >
          Please Login First!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-gray-300 mb-8"
        >
          To access your tutor dashboard and manage your courses, please sign in to your account.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tutorLogin')}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300"
        >
          Login Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TutorLoginPrompt;