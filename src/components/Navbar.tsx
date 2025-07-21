import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Home, Mail, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="flex items-center">
              <span>
                <span className="text-[#8B0000] font-medium">my</span>{' '}
                <span className="text-[#003366] font-medium">Social Security</span>
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-gray-700">
                <User size={20} className="mr-2" />
                <span>Joe Smith</span>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <Link 
              to="/" 
              className="flex items-center py-3 border-b-2 border-blue-600 text-blue-600"
            >
              <Home size={18} className="mr-2" />
              Home
            </Link>
            <Link 
              to="/messages" 
              className="flex items-center py-3 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800"
            >
              <Mail size={18} className="mr-2" />
              Messages
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center py-3 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800"
            >
              <UserCircle size={18} className="mr-2" />
              My Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;