import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { submitFeedback, getCurrentSessionId } from '../services/api_dev';
import { FeedbackPayload } from '../types';
import FeedbackModal from './FeedbackModal';

interface MessageReactionsProps {
  messageId: string;
  currentReaction?: 'thumbs_up' | 'thumbs_down' | null;
  onReactionChange: (reaction: 'thumbs_up' | 'thumbs_down' | null) => void;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  currentReaction,
  onReactionChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Check if user is on mobile device
  const isMobile = () => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleReaction = async (reaction: 'thumbs_up' | 'thumbs_down') => {
    const newReaction = currentReaction === reaction ? null : reaction;
    onReactionChange(newReaction);

    if (newReaction === 'thumbs_up') {
      const sessionId = getCurrentSessionId();
      if (!sessionId) {
        console.error('Session ID not found, cannot submit feedback.');
        return;
      }

      const feedbackData: FeedbackPayload = {
        messageId,
        sessionId,
        reaction: 'thumbs_up',
      };

      try {
        setIsSubmitting(true);
        await submitFeedback(feedbackData);
        setShowFeedback(true);
        setFeedbackType('positive');
        setTimeout(() => setShowFeedback(false), 5000);
      } catch (error) {
        console.error('Error submitting feedback:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else if (newReaction === 'thumbs_down') {
      setShowFeedbackModal(true);
    }
  };

  const handleTellUsMore = () => {
    setShowFeedbackModal(true);
    setShowFeedback(false);
  };

  const handleModalClose = async (submitted: boolean) => {
    setShowFeedbackModal(false);
    if (!submitted) {
      // If the user just closes the modal, send the thumbs_down reaction
      const sessionId = getCurrentSessionId();
      if (!sessionId) {
        console.error('Session ID not found, cannot submit feedback.');
        return;
      }
      const feedbackData: FeedbackPayload = {
        messageId,
        sessionId,
        reaction: 'thumbs_down',
      };
      try {
        await submitFeedback(feedbackData);
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3 mt-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleReaction('thumbs_up')}
            disabled={isSubmitting}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              currentReaction === 'thumbs_up'
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Helpful response"
            title="This response was helpful"
          >
            <ThumbsUp 
              size={16} 
              className={currentReaction === 'thumbs_up' ? 'fill-current' : ''} 
            />
          </button>
          
          <button
            onClick={() => handleReaction('thumbs_down')}
            disabled={isSubmitting}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              currentReaction === 'thumbs_down'
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Not helpful response"
            title="This response was not helpful"
          >
            <ThumbsDown 
              size={16} 
              className={currentReaction === 'thumbs_down' ? 'fill-current' : ''} 
            />
          </button>
        </div>
        
        {showFeedback && feedbackType && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 italic">
            {feedbackType === 'positive' ? (
              <span>Thanks!</span>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Show different content based on device type */}
                {isMobile() ? (
                  <>
                    <span>Thank you.</span>
                    <button
                      onClick={handleTellUsMore}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Tell us more
                    </button>
                  </>
                ) : (
                  <>
                    <span>Thank you for the feedback.</span>
                    <button
                      onClick={handleTellUsMore}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Tell us more
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleModalClose}
        messageId={messageId}
      />
    </>
  );
};

export default MessageReactions;