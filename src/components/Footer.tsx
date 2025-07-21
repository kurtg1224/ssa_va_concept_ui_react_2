import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Benefits</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Retirement</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Disability</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Medicare</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Survivors</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">SSI</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Information For</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Retirees</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">People with Disabilities</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Current Beneficiaries</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Veterans</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Government Employees</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">my Social Security</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Online Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Forms</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Publications</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Office Locator</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sign Up for Updates</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white transition-colors">FOIA</a>
              <a href="#" className="hover:text-white transition-colors">No FEAR Act</a>
            </div>
          </div>
          <p>This is a prototype for demonstration purposes only. Not affiliated with the actual Social Security Administration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;