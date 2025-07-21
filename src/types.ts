export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isHtml?: boolean;
  reaction?: 'thumbs_up' | 'thumbs_down' | null;
  sources?: RetrievedDoc[];
}

export interface MessageResponse {
  text: string;
  messageId: string;
  intent?: string;
  isHtml?: boolean;
  sources?: RetrievedDoc[];
}

export interface FeedbackPayload {
  messageId: string;
  sessionId: string; // This will be passed from the chat session
  reaction: 'thumbs_up' | 'thumbs_down';
  issues?: string[];
  comment?: string;
}

export interface RetrievedDoc {
  text: string;
  score: number;
  id: string;
  metadata: {
    sourceid: string;
    "Unnamed: 0": string;
    type: string;
    title: string;
    processingdate: string;
    context?: string;
  };
}

export interface RAGResponse {
  responsecontent: string;
  retrieveddocs: RetrievedDoc[];
}