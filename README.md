# SSA Web Prototype UI

A React/TypeScript concept for a Social Security Administration web interface with an integrated AI chatbot assistant.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture

### Frontend Structure
- **React 18** with **TypeScript** and **Vite**
- **TailwindCSS** for styling
- **React Router v6** for client-side routing
- **React Context API** for state management

### Key Components
- `src/components/` - Reusable UI components
- `src/context/` - React Context providers
  - `BenefitApplicationContext` - Form data state management
  - `ChatContext` - Chat UI state management
- `src/pages/` - Page components and routes
- `src/services/` - API services
- `src/utils/` - Utility functions

### Data Flow
- Form data is managed through React Context
- Chat messages are sent with form HTML context when on benefit application pages
- Session management preserves chat history during navigation

## API Endpoints

### Chat API
- `POST /chat` - Send message to chatbot
  - Payload: `{ message: string, session_id?: string }`
  - Response: `{ response_msg: string, messageId: string, rag_sources: object, session_id: string }`

### Feedback API
- `POST /feedback` - Submit feedback for chat messages
  - Payload: `{ messageId: string, sessionId: string, rating: number, comments?: string }`

### Backend Configuration
- API base URL: `http://localhost:8001`
- Backend uses Cosmos DB for feedback storage. Could be changed to use other database.