import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="mt-32 py-12 border-t border-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-teal-400">LearnLink</h2>
            <p className="mt-2 text-sm">Empowering Education, Connecting Communities</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <p className="text-sm">&copy; 2024 LearnLink. All Rights Reserved.</p>
            <p className="text-sm mt-1">Owned by YadhuKrishna</p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <a href="#" className="mx-2 text-gray-400 hover:text-teal-400 transition-colors duration-300">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="mx-2 text-gray-400 hover:text-teal-400 transition-colors duration-300">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="mx-2 text-gray-400 hover:text-teal-400 transition-colors duration-300">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/yadhukrishna-kishore-4b7469244/" className="mx-2 text-gray-400 hover:text-teal-400 transition-colors duration-300">
              <FaLinkedinIn size={20} />
            </a>
            <a href="https://github.com/yadhukishore/LearnLink-MERN" className="mx-2 text-gray-400 hover:text-teal-400 transition-colors duration-300">
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;