import { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center p-6">
            <div className="flex items-center space-x-4">
              <img src="/Navi.png" alt="Logo" className="h-10" />
              <nav className="hidden md:flex space-x-4">
                <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
                <a href="#courses" className="text-gray-700 hover:text-gray-900">Courses</a>
                <a href="#book-store" className="text-gray-700 hover:text-gray-900">Book Store</a>
                <a href="#chats" className="text-gray-700 hover:text-gray-900">Chats</a>
                <a href="#about-us" className="text-gray-700 hover:text-gray-900">About Us</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <img src="/path/to/profile-pic.png" alt="Profile" className="h-10 w-10 rounded-full" />
              </div>
              <div className="md:hidden">
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="text-gray-700 focus:outline-none focus:text-gray-900"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="md:hidden bg-white shadow-md">
              <nav className="flex flex-col space-y-4 p-4">
                <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
                <a href="#courses" className="text-gray-700 hover:text-gray-900">Courses</a>
                <a href="#book-store" className="text-gray-700 hover:text-gray-900">Book Store</a>
                <a href="#chats" className="text-gray-700 hover:text-gray-900">Chats</a>
                <a href="#about-us" className="text-gray-700 hover:text-gray-900">About Us</a>
              </nav>
            </div>
          )}
        </header>
      );
}

export default Header