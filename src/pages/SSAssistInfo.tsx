import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SSAssistInfo: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            What to Know About SSA's New 'SSAssist' Chatbot
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About SSAssist</h2>
            <p className="text-gray-600 mb-6">
              SSAssist is a virtual assistant that can help you with Social Security. It can -- 
              <ul>
                <li>Answer questions about our programs</li>
                <li>Help guide you on where to go to complete your business with us</li>
                <li>You can even complete a few tasks like looking up the closest SSA office to your address or researching baby names</li>
              </ul>
            </p>
            <p className="text-gray-600 mb-6">
              Plus, when you use SSAssist within your MySSA account, it can help you with additional tasks like understanding the status of your claim and helping you with select forms and self-service tools.
            </p>            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Understanding AI Technology</h3>
            <p className="text-gray-600 mb-6">
              SSAssist is powered by generative artificial intelligence technology, similar to ChatGPT. While this technology allows us to provide immediate assistance 24/7, it's important to understand that, like our human staff, the chatbot may occasionally make mistakes or provide incomplete information.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-[#1E40AF] p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> If you notice any discrepancy between information provided by SSAssist and content on our official website, always rely on the website content. The information on our website is authoritative and regularly updated to ensure accuracy.
              </p>
            </div>
          </div>

          <div id="feedback-section" className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Give Us Feedback on SSAssist or Report Issues</h2>
            <p className="text-gray-600 mb-6">
              Your feedback is valuable and helps us improve SSAssist's performance. We carefully review all feedback to enhance the accuracy and helpfulness of our chatbot.
            </p>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="feedback-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Feedback
                </label>
                <select 
                  id="feedback-type"
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
                >
                  <option value="">Select a category</option>
                  <option value="incorrect">Incorrect Information</option>
                  <option value="unclear">Unclear Response</option>
                  <option value="helpful">Helpful Experience</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
                  placeholder="Please describe your experience or the issue you encountered..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#1E40AF] text-white px-6 py-2 rounded-lg hover:bg-[#1E3A8A] transition-colors"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SSAssistInfo;