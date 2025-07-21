import { MessageResponse, RetrievedDoc, FeedbackPayload } from '../types';
import showdown from 'showdown';

// API Configuration
const API_BASE_URL = 'http://localhost:8001';

// Initialize Showdown converter for Markdown to HTML
const markdownConverter = new showdown.Converter();
markdownConverter.setOption('openLinksInNewWindow', true);

// Session management
let currentSessionId: string | null = null;

// Export a function to get the current session ID
export const getCurrentSessionId = (): string | null => {
  return currentSessionId;
};

// Interface for the expected RAG response structure
interface RAGResponse {
  response_msg: string;
  messageId: string;
  rag_sources: Record<string, {
    url: string;
    title: string;
    text: string;
    score?: number;
  }>;
  session_id?: string;
}

// Add a utility function for generating unique IDs
const generateUniqueId = (prefix: string = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Parse the API response to extract message, sources, and session ID.
 */
const parseAPIResponse = (responseText: string): RAGResponse => {
  try {
    // Step 1: Parse the outer JSON object
    const outerParsed = JSON.parse(responseText);

    if (!outerParsed || typeof outerParsed !== 'object') {
      throw new Error('Outer response is not a valid object.');
    }

    // Step 2: Extract the session_id from the outer object
    const session_id = outerParsed.session_id;

    // Step 3: Parse the inner JSON string from the 'response' field
    if (typeof outerParsed.response !== 'string') {
      throw new Error('Inner response field is not a string.');
    }
    const innerParsed = JSON.parse(outerParsed.response);

    if (!innerParsed || typeof innerParsed !== 'object') {
      throw new Error('Inner response is not a valid object.');
    }

    // Step 4: Extract the message, messageId, and sources from the inner object
    const response_msg = innerParsed.response_msg || '';
    const messageId = innerParsed.message_id || generateUniqueId('api_');
    const rag_sources = innerParsed.rag_sources || {};

    return { response_msg, messageId, rag_sources, session_id };

  } catch (error) {
    console.error('Failed to parse API response:', error);
    // Log the problematic response text for debugging
    console.error('Problematic response text:', responseText);
    throw new Error(`Failed to parse API response: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Send message to API and handle response
 */
export const sendMessage = async (text: string): Promise<MessageResponse> => {
  try {
    const requestBody: { message: string; session_id?: string } = { message: text };
    if (currentSessionId) {
      requestBody.session_id = currentSessionId;
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseText = await response.text();
    
    try {
      const apiResponse = parseAPIResponse(responseText);

      if (apiResponse.session_id) {
        currentSessionId = apiResponse.session_id;
        console.log('Chat session ID set:', currentSessionId);
      }

      const htmlContent = markdownConverter.makeHtml(apiResponse.response_msg);
      const hasRagSources = apiResponse.rag_sources && Object.keys(apiResponse.rag_sources).length > 0;
      
      const formatSources = (sources: RAGResponse['rag_sources']): RetrievedDoc[] => {
        return Object.entries(sources).map(([id, source]) => ({
          text: source.text,
          score: source.score || 0,
          id: id,
          metadata: {
            sourceid: id,
            "Unnamed: 0": id,
            type: 'web',
            title: source.title || 'Source',
            processingdate: new Date().toISOString(),
            context: source.text
          }
        }));
      };

      const sources = hasRagSources ? formatSources(apiResponse.rag_sources) : undefined;
      
      return {
        text: htmlContent,
        messageId: apiResponse.messageId,
        intent: hasRagSources ? 'rag_response' : 'simple_response',
        isHtml: true,
        sources
      };
    } catch (error) {
      console.error('Error parsing API response:', error);
      return {
        text: 'Sorry, I encountered an error processing your request. Please try again later.',
        messageId: generateUniqueId('error_'),
        intent: 'error',
        isHtml: false,
      };
    }

  } catch (error) {
    console.error('Error sending message to API:', error);
    const errorMessage = error instanceof Error && error.message.toLowerCase().includes('failed to fetch')
      ? 'Could not connect to the assistant. Please ensure it is running and accessible.'
      : 'An unexpected error occurred while contacting the assistant.';
    return {
      text: errorMessage,
      messageId: generateUniqueId('error_'),
      intent: 'error',
      isHtml: false,
    };
  }
};

/**
 * Reset chat session
 */
export const resetChatSession = (): void => {
  currentSessionId = null;
};

/**
 * Submits feedback to the backend.
 */
export const submitFeedback = async (feedbackData: FeedbackPayload): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('Submitting feedback to backend:', feedbackData);

    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    return {
      success: true,
      message: 'Thank you for your feedback!'
    };
  } catch (error) {
    console.error('Failed to send feedback:', error);
    return {
      success: false,
      message: 'Failed to send feedback. Please try again.'
    };
  }
};