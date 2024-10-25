import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    };
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/Navi.png" 
            alt="Logo" 
            className="h-8 w-auto sm:h-10 md:h-12 rounded-md"
          />
          <span className="ml-2 text-lg sm:text-xl md:text-2xl font-bold">LearnLink</span>
        </div>
   {/* Navigation */}
   <nav className="hidden md:flex space-x-4">
          <button onClick={() => scrollToSection('home')} className="hover:text-indigo-200">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-indigo-200">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-indigo-200">Services</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-200">Contact</button>
        </nav>

         {/* Buttons */}
         <div className="flex items-center">
          <Link to="/login" className="bg-white text-purple-600 px-3 py-1 rounded text-sm sm:text-base sm:px-4 sm:py-2 hover:bg-indigo-100 transition duration-300">
            Login
          </Link>
          <Link to="/register" className="ml-2 bg-indigo-500 text-white px-3 py-1 rounded text-sm sm:text-base sm:px-4 sm:py-2 hover:bg-indigo-600 transition duration-300">
            Register
          </Link>
        </div>

          {/* Mobile Menu Button */}
          <button 
          className="md:hidden bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-600">
          <nav className="flex flex-col space-y-2 p-4">
            <a href="#" className="block text-white hover:text-indigo-200">Home</a>
            <a href="#" className="block text-white hover:text-indigo-200">About</a>
            <a href="#" className="block text-white hover:text-indigo-200">Services</a>
            <a href="#" className="block text-white hover:text-indigo-200">Contact</a>
            <div className="flex flex-col space-y-2 mt-4">
              <button className="bg-white text-purple-600 px-3 py-1 rounded text-sm hover:bg-indigo-100 transition duration-300">
                Login
              </button>
              <button className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600 transition duration-300">
                Register
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;