import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, X, Bot, Info } from 'lucide-react';
// Fix import path to ensure TypeScript finds it correctly
import { sendMessage } from '../services/api_dev';
import { Message } from '../types';
import { getGreeting } from '../utils/helpers';
import MessageReactions from './MessageReactions';
import { useLocation } from 'react-router-dom';
import SourcesModal from './SourcesModal';

interface ChatInterfaceProps {
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onMessagesUpdate }) => {

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sourcesModal, setSourcesModal] = useState<{ isOpen: boolean; messageId?: string }>({ isOpen: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const location = useLocation();

  // Generate unique IDs to avoid collisions
  const generateUniqueId = (prefix: string = '') => {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = getGreeting();
      const initialMessage: Message = {
        id: generateUniqueId('bot_'),
        text: `${greeting} I'm SSAssist, your virtual assistant. I can help you with questions about Social Security benefits, services, and more. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date(),
        reaction: null
      };
      
      setIsTyping(true);
      
      setTimeout(() => {
        onMessagesUpdate([initialMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReactionChange = (messageId: string, reaction: 'thumbs_up' | 'thumbs_down' | null) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, reaction } : msg
    );
    onMessagesUpdate(updatedMessages);
  };

  const handleShowSources = (messageId: string) => {
    setSourcesModal({ isOpen: true, messageId });
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        // Here you would normally send the audio data to your speech-to-text API
        console.log('Audio data available:', event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        // Simulating speech-to-text API response
        setInput('This is placeholder speech-to-text output text');
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    let messageToSend = input;
    
    // Check if the user is on a benefits application page
    if (location.pathname.startsWith('/benefits-application')) {
      const formElement = document.querySelector('form');
      const pageHtml = formElement ? formElement.innerHTML : 'Could not find a form on the page.';

      messageToSend = `User's Question: ${input}\n\n--- Page Context ---\n\n${pageHtml}`;
    }

    // Log the exact payload being sent to the API
    console.log('Sending to API:', messageToSend);
    
    // Create a user message without an ID (server will assign it)
    const userMessage: Message = {
      id: '', // Empty ID, will be replaced with server-assigned ID if available
      text: input,
      sender: 'user',
      timestamp: new Date(),
      reaction: null
    };
    
    // Add the user message to the UI immediately
    onMessagesUpdate([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage(messageToSend);
      
      console.log('ChatInterface received response:', JSON.stringify(response, null, 2));
      
      // Update user message ID if server provided one
      if (response.messageId) {
        // Find the user message we just added
        const updatedMessages = [...messages];
        const userMessageIndex = updatedMessages.length - 1;
        if (userMessageIndex >= 0 && updatedMessages[userMessageIndex].sender === 'user') {
          // Update with server-assigned ID if available
          updatedMessages[userMessageIndex] = {
            ...updatedMessages[userMessageIndex],
            id: `user_${response.messageId}`
          };
        }
        
        // Create the bot message with the API-supplied messageId
        const botMessage: Message = {
          id: `bot_${response.messageId}`,
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          isHtml: response.isHtml,
          reaction: null,
          sources: response.sources
        };
        
        // Add the bot message
        updatedMessages.push(botMessage);
        onMessagesUpdate(updatedMessages);
      } else {
        // If no messageId from server, create bot message with generated ID
        const botMessage: Message = {
          id: generateUniqueId('bot_'),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          isHtml: response.isHtml,
          reaction: null,
          sources: response.sources
        };
        
        onMessagesUpdate([...messages, userMessage, botMessage]);
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      setTimeout(() => {
        const errorMessage: Message = {
          id: generateUniqueId('error_'),
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
          reaction: null
        };
        
        onMessagesUpdate([...messages, userMessage, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((message, index) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'user' ? (
              <div className="max-w-[75%] mb-1">
                <div className="bg-[#1E40AF] text-white rounded-lg px-4 py-2 rounded-br-none" style={{ fontSize: '0.9em' }}>
                  <p>{message.text}</p>
                </div>
              </div>
            ) : (
              <div className="w-full pr-2">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 rounded-bl-none [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center mt-0.5">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex-1" style={{ fontSize: '0.9em' }}>
                      {message.isHtml ? (
                        <p dangerouslySetInnerHTML={{ __html: message.text }} />
                      ) : (
                        <p>{message.text}</p>
                      )}

                      {message.sources && message.sources.length > 0 && (
                        <div className="flex items-center mt-2 gap-2">
                          <button
                            onClick={() => handleShowSources(message.id)}
                            className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200 hover:scale-110 group"
                            title={`View ${message.sources.length} source document${message.sources.length !== 1 ? 's' : ''}`}
                            aria-label={`View ${message.sources.length} source document${message.sources.length !== 1 ? 's' : ''}`}
                          >
                            <Info size={12} className="group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleShowSources(message.id)}
                            className="text-xs text-gray-500 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                            title={`View ${message.sources.length} source document${message.sources.length !== 1 ? 's' : ''}`}
                          >
                            {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start mt-0.5 pl-1">
                  {index > 0 && (
                    <MessageReactions
                      messageId={message.id}
                      currentReaction={message.reaction}
                      onReactionChange={(reaction) => handleReactionChange(message.id, reaction)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-full pr-2">
              <div className="bg-gray-100 rounded-lg px-3 py-2 rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            className="w-full pr-24 pl-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
            aria-label="Type your message"
          />
          <div className="absolute right-1 bottom-1 flex space-x-1">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? <X size={20} className="font-bold" /> : <Mic size={20} />}
            </button>
            <button
              type="submit"
              className={`p-2 rounded-full ${
                !input.trim() 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#1E40AF] text-white hover:bg-[#1E3A8A]'
              } transition-colors`}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <div className="px-4 pt-3 text-xs text-gray-400">
          NOTE: SSA designed SSAssist to be accurate, but it can make mistakes.{' '}
          <a 
            href="/ssassist-info" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#1E40AF] hover:underline"
          >
            Learn more
          </a>
        </div>
      </div>

      <SourcesModal
        isOpen={sourcesModal.isOpen}
        onClose={() => setSourcesModal({ isOpen: false })}
        message={sourcesModal.messageId ? messages.find(m => m.id === sourcesModal.messageId) : undefined}
      />
    </div>
  );
};

export default ChatInterface;