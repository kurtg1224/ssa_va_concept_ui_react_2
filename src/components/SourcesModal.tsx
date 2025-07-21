import React, { useEffect } from 'react';
import { X, FileText, Calendar, Hash, Tag } from 'lucide-react';
import { Message, RetrievedDoc } from '../types';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: Message;
}

const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose, message }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !message?.sources) return null;

  const formatScore = (score: number): string => {
    return (score * 100).toFixed(1) + '%';
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Retrieved Sources
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {message.sources.length} document{message.sources.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close sources modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {message.sources.map((doc: RetrievedDoc, index: number) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Document Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-blue-600 flex-shrink-0" />
                        <h3 className="font-medium text-gray-900 text-sm">
                          {doc.metadata.title || `Document ${index + 1}`}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            <span className="font-medium">Type:</span>
                            <span className="capitalize">{doc.metadata.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash size={12} />
                            <span className="font-medium">Score:</span>
                            <span className="font-mono text-green-600">{formatScore(doc.score)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(doc.metadata.processingdate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">ID:</span>
                          <span className="font-mono text-xs bg-gray-200 px-1 rounded break-all">
                            {doc.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content:</h4>
                    <div className="bg-gray-50 rounded p-3 text-sm text-gray-800 leading-relaxed">
                      {doc.text}
                    </div>
                  </div>

                  {/* No Metadata Details Section */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              This information is for debugging purposes and shows the source documents used to generate the response.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcesModal;