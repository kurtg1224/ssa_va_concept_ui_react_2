import React from 'react';
import { Bot } from 'lucide-react';
import { Message } from '../types';

interface PrintableChatProps {
  messages: Message[];
}

const PrintableChat: React.FC<PrintableChatProps> = ({ messages }) => {
  return (
    <div className="print-container p-8">
      <div className="print-header mb-6 text-center">
        <h1 className="text-xl font-bold mb-1">SSAssist Chat Conversation</h1>
        <p className="text-gray-600 text-sm">
          {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
        </p>
      </div>
      <div className="print-messages space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="chat-message">
            <div className={`chat-message-container flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'bot' && (
                <div className="chat-avatar mr-3 flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-blue-600" />
                  </div>
                </div>
              )}
              <div 
                className={`chat-bubble max-w-[80%] p-4 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <div className="chat-message-text whitespace-pre-wrap">
                  {message.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintableChat;
