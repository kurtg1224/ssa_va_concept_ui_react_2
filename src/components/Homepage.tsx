import React from 'react';
import { Link } from 'react-router-dom';
import { Download, CreditCard, Upload, Search, FilePenLine } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Homepage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Welcome, Joe!</h1>
        
        <div className="bg-white rounded shadow-sm p-4 mb-6">
          <p className="text-gray-700">
            You last signed in on April 25, 2025 at 9:52 PM ET.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-gray-200 rounded overflow-hidden shadow-sm mb-6">
          <Link 
            to="/statement"
            className="bg-white p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Download className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-blue-600 font-medium">Your Social Security Statement</h2>
                <p className="text-gray-600 text-sm">You can download your statement as a PDF or XML file.</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/replace-card"
            className="bg-white p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-blue-600 font-medium">Replace your Social Security Card</h2>
                <p className="text-gray-600 text-sm">Request a replacement card online.</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/verification-letter"
            className="bg-white p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Download className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-blue-600 font-medium">Your Benefit Verification Letter</h2>
                <p className="text-gray-600 text-sm">Your letter proving you receive or do not receive Social Security Benefits.</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/benefits-application"
            className="bg-white p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <FilePenLine className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-blue-600 font-medium">Apply for Benefits</h2>
                <p className="text-gray-600 text-sm">You can apply for benefits online.</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-4">
            <div className="flex items-center gap-4">
              <Upload className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-blue-600 font-medium">Upload Documents</h2>
                <p className="text-gray-700 text-sm mb-1">You have no pending requests.</p>
                <p className="text-gray-600 text-sm">Complete open requests, search and submit forms online, or upload your documents (medical records, pay stubs etc.).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
              <Search className="w-6 h-6 text-gray-900 flex-shrink-0" />
              <h2 className="text-gray-900 text-xl font-medium">Eligibility and Earnings</h2>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 mb-3">
                You have the 40 work credits you need to receive benefits!
              </p>
              <div className="flex gap-1 mb-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-1 h-6 bg-green-600 rounded" />
                ))}
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white">
                  ✓
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                This includes credits not yet reported on your earnings record from last year and this year if you continued to work.
              </p>
              
              <p className="text-gray-900 mb-2">
                You earned <span className="font-semibold">$78,550</span> in 2024. <Link to="/verify-earnings" className="text-blue-600 hover:underline">Is this correct?</Link>
              </p>
              
              <Link to="/earnings-record" className="text-blue-600 hover:underline block mb-4">
                Review your full earnings record now
              </Link>
              
              <button className="text-blue-600 hover:underline flex items-center gap-1">
                Learn more about eligibility and work credits
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;