import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { submitFeedback, getCurrentSessionId } from '../services/api_dev';
import { FeedbackPayload } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: (submitted: boolean) => void;
  messageId: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, messageId }) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    { id: 'inaccurate', label: 'Inaccurate information' },
    { id: 'unclear', label: 'Unclear response' },
    { id: 'incomplete', label: 'Incomplete answer' },
    { id: 'irrelevant', label: 'Not relevant to my question' },
    { id: 'unhelpful', label: 'Not helpful' },
    { id: 'other', label: 'Other issue' }
  ];

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
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

  const toggleIssue = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sessionId = getCurrentSessionId();
    if (!sessionId) {
      console.error('Session ID not found, cannot submit feedback.');
      setIsSubmitting(false);
      return;
    }

    const feedbackData: FeedbackPayload = {
      messageId,
      sessionId,
      reaction: 'thumbs_down',
      issues: selectedIssues,
      comment: feedbackText,
    };

    try {
      await submitFeedback(feedbackData);
      setSelectedIssues([]);
      setFeedbackText('');
      onClose(true);
    } catch (error) {
      console.error('Error submitting detailed feedback:', error);
      onClose(false); // Close even if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => onClose(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Help us improve SSAssist
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close feedback form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Issue Type Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              What was the issue? (Select all that apply)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {issueTypes.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => toggleIssue(issue.id)}
                  className={`text-left px-3 py-2 rounded-md border transition-all duration-200 ${
                    selectedIssues.includes(issue.id)
                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {issue.label}
                </button>
              ))}
            </div>
          </div>

          {/* Free Text Input */}
          <div className="mb-6">
            <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-700 mb-2">
              Tell Us More
            </label>
            <textarea
              id="feedback-text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Share any additional details that might help us improve..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;