import React, { useRef, useEffect, useState } from 'react';
import ChatInterface from './ChatInterface';
import PrintableChat from './PrintableChat';
import { MessageCircle, Maximize2, Minimize2, X, MoreVertical } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/print.css';

const ChatbotWidget: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen, isExpanded, setIsExpanded, messages, updateMessages } = useChat();
  const chatRef = useRef<HTMLDivElement>(null);

  // Check if user is on mobile device
  const isMobile = () => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen, setIsExpanded]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, setIsOpen, setIsExpanded]);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  const toggleChat = () => {
    const mobile = isMobile();
    setIsOpen(!isOpen);
    
    // Auto-expand for mobile devices when opening
    if (!isOpen && mobile) {
      setIsExpanded(true);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsExpanded(false);
    setMenuOpen(false);
  };
  
  // Print handler
  const handlePrint = () => {
    setMenuOpen(false);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the chat');
      return;
    }
    
    // Write the print-optimized content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSAssist Chat Conversation - Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .chat-message { margin-bottom: 20px; page-break-inside: avoid; }
            .chat-message-container { display: flex; }
            .chat-message-container.justify-end { justify-content: flex-end; }
            .chat-message-container.justify-start { justify-content: flex-start; }
            .chat-avatar { margin-right: 12px; }
            .chat-bubble { max-width: 80%; padding: 16px; border-radius: 12px; }
            .chat-bubble.user { background-color: #2563eb; color: white; border-top-right-radius: 0; }
            .chat-bubble.bot { background-color: #f3f4f6; color: #111827; border-top-left-radius: 0; }
            .chat-avatar-icon { width: 32px; height: 32px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .print-header { text-align: center; margin-bottom: 24px; }
            .print-header h1 { font-size: 20px; margin-bottom: 4px; }
            .print-header p { font-size: 14px; color: #666; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>SSAssist Chat Conversation</h1>
            <p>${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>
          </div>
          <div class="print-messages">
            ${messages.map((message) => `
              <div class="chat-message">
                <div class="chat-message-container ${message.sender === 'user' ? 'justify-end' : 'justify-start'}">
                  ${message.sender === 'bot' ? `
                    <div class="chat-avatar">
                      <div class="chat-avatar-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="11" width="8" height="10" rx="2" ry="2"></rect>
                          <rect x="15" y="11" width="6" height="10" rx="2" ry="2"></rect>
                          <rect x="9" y="3" width="6" height="10" rx="2" ry="2"></rect>
                        </svg>
                      </div>
                    </div>
                  ` : ''}
                  <div class="chat-bubble ${message.sender === 'user' ? 'user' : 'bot'}">
                    <div class="chat-message-text">${message.text.replace(/\n/g, '<br>')}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `);
    
    // Trigger print and close the window after printing
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (some browsers may do this automatically)
      printWindow.onafterprint = () => printWindow.close();
    }, 500);
  };

  // Save handler (PDF download)
  const handleSave = () => {
    setMenuOpen(false);
    
    // Create a temporary div to render the printable chat
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '800px'; // Set width for better quality
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px'; // Position off-screen
    tempDiv.style.top = '0';
    tempDiv.style.padding = '20px';
    tempDiv.style.backgroundColor = 'white';
    document.body.appendChild(tempDiv);
    
    // Create a formatted date string for the filename
    const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
    const timeStr = new Date().toLocaleTimeString().replace(/:/g, '-').replace(/\s/g, '');
    const filename = `chat-conversation-${dateStr}-${timeStr}.pdf`;
    
    // Render the printable content
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 20px; margin-bottom: 4px;">SSAssist Chat Conversation</h1>
          <p style="color: #666; font-size: 14px;">${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>
        </div>
        <div>
          ${messages.map((message) => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; ${message.sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}">
                ${message.sender === 'bot' ? `
                  <div style="margin-right: 12px;">
                    <div style="width: 32px; height: 32px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="8" height="10" rx="2" ry="2"></rect>
                        <rect x="15" y="11" width="6" height="10" rx="2" ry="2"></rect>
                        <rect x="9" y="3" width="6" height="10" rx="2" ry="2"></rect>
                      </svg>
                    </div>
                  </div>
                ` : ''}
                <div style="
                  max-width: 80%; 
                  padding: 16px; 
                  border-radius: 12px; 
                  ${message.sender === 'user' 
                    ? 'background-color: #2563eb; color: white; border-top-right-radius: 0;' 
                    : 'background-color: #f3f4f6; color: #111827; border-top-left-radius: 0;'}
                ">
                  <div>${message.text.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Use html2canvas to convert the div to an image
    html2canvas(tempDiv, {
      scale: 1.5, // Reduced scale for better performance while maintaining readability
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      // Create PDF with jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Enable compression
      });
      
      // Calculate dimensions to fit the canvas in the PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF with compression
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality for smaller file size
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Fix for duplicate content - we don't need to add more pages with the same content
      // Only add additional pages if content exceeds page height
      const pageHeight = 295; // A4 height in mm
      
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight;
        let position = -pageHeight;
        
        while (heightLeft > 0) {
          position -= Math.min(heightLeft, pageHeight);
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      // Save the PDF
      pdf.save(filename);
      
      // Clean up
      document.body.removeChild(tempDiv);
    });
  };
  
  // Save HTML handler
  const handleSaveHTML = () => {
    setMenuOpen(false);
    
    // Create a formatted date string for the filename
    const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
    const timeStr = new Date().toLocaleTimeString().replace(/:/g, '-').replace(/\s/g, '');
    const filename = `chat-conversation-${dateStr}-${timeStr}.html`;
    
    // Create HTML content with styling
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSAssist Chat Conversation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      border-bottom: 1px solid #eee;
      padding-bottom: 12px;
    }
    .header h1 {
      font-size: 20px;
      margin-bottom: 4px;
    }
    .header p {
      font-size: 14px;
      color: #666;
      margin-top: 0;
    }
    .chat-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .message {
      display: flex;
      margin-bottom: 16px;
    }
    .message.user {
      justify-content: flex-end;
    }
    .message.bot {
      justify-content: flex-start;
    }
    .avatar {
      width: 32px;
      height: 32px;
      background-color: #dbeafe;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .bubble {
      max-width: 80%;
      padding: 16px;
      border-radius: 12px;
      position: relative;
    }
    .user .bubble {
      background-color: #2563eb;
      color: white;
      border-top-right-radius: 0;
    }
    .bot .bubble {
      background-color: #f3f4f6;
      color: #111827;
      border-top-left-radius: 0;
    }
    .timestamp {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SSAssist Chat Conversation</h1>
    <p>${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>
  </div>
  <div class="chat-container">
    ${messages.map((message) => `
      <div class="message ${message.sender === 'user' ? 'user' : 'bot'}">
        ${message.sender === 'bot' ? `
          <div class="avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="8" height="10" rx="2" ry="2"></rect>
              <rect x="15" y="11" width="6" height="10" rx="2" ry="2"></rect>
              <rect x="9" y="3" width="6" height="10" rx="2" ry="2"></rect>
            </svg>
          </div>
        ` : ''}
        <div class="bubble">
          ${message.text.replace(/\n/g, '<br>')}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <>
      {/* Hidden printable version of chat for direct window.print() method */}
      <div className="hidden">
        <PrintableChat messages={messages} />
      </div>
      
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          aria-hidden="true"
        />
      )}
      <div 
        ref={chatRef}
        className={`fixed z-50 transition-all duration-300 ${
          isOpen 
            ? isExpanded 
              ? 'inset-4 md:inset-8 lg:inset-12' 
              : 'bottom-8 right-8 w-96 md:w-[30rem] h-[560px]' 
            : 'bottom-8 right-8 w-auto h-auto'
        }`}
        aria-label="Chat with SSAssist"
      >
        {isOpen ? (
          <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#1a2951] text-white px-4 py-3 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center">
                <MessageCircle size={20} className="mr-2" />
                <h2 className="font-semibold">SSAssist</h2>
              </div>
              <div className="flex items-center space-x-2">
                {/* Hide expand/minimize button on mobile since it auto-expands */}
                {!isMobile() && (
                  <button 
                    onClick={toggleExpand}
                    className="p-2 hover:bg-[#243660] rounded transition-colors"
                    aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
                  >
                    {isExpanded ? (
                      <Minimize2 size={20} />
                    ) : (
                      <Maximize2 size={20} />
                    )}
                  </button>
                )}
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 hover:bg-[#243660] rounded transition-colors"
                    aria-label="Chat options"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 flex flex-col z-30"
                    >
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg text-gray-800 text-sm"
                        onClick={handlePrint}
                      >
                        Print
                      </button>
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100 text-gray-800 text-sm"
                        onClick={handleSave}
                      >
                        Save (PDF)
                      </button>
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg text-gray-800 text-sm"
                        onClick={handleSaveHTML}
                      >
                        Save (HTML)
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={closeChat}
                  className="p-2 hover:bg-[#243660] rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatInterface messages={messages} onMessagesUpdate={updateMessages} />
            </div>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className="flex items-center bg-[#1e3a8a] text-white px-4 py-3 rounded-lg shadow-lg hover:bg-[#1e2563] transition-colors animate-bounce-subtle"
            aria-label="Open SSAssist chatbot"
          >
            <MessageCircle size={20} className="mr-2" />
            <span className="font-medium">Need help? Try SSAssist!</span>
          </button>
        )}
      </div>
    </>
  );
};

export default ChatbotWidget;