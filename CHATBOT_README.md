# Farming Assistant Chatbot

A comprehensive AI-powered chatbot system for farmers with voice input, multi-language support, and intelligent farming advice.

## Features

- **Voice Input**: Web Speech API integration with microphone button
- **Multi-language Support**: Hindi and English with automatic UI translation
- **Smart Farming Advice**: GPT-4 powered responses for farming questions
- **Weather Integration**: Optional weather data for location-specific advice
- **User Authentication**: Supabase authentication with user-specific chat history
- **Chat Persistence**: MongoDB storage for conversation history
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Features**: Loading indicators, typing effects, and voice feedback

## Installation

### Frontend Setup

1. Install dependencies:
```bash
cd client
npm install lucide-react @supabase/supabase-js
```

2. Add the ChatBotWidget to your main App component:

```jsx
import ChatBotWidget from './components/ChatBotWidget';

function App() {
  return (
    <div className="App">
      {/* Your existing components */}
      
      {/* Add the floating chatbot widget */}
      <ChatBotWidget />
    </div>
  );
}
```

### Backend Setup

1. Create a new directory for the server:
```bash
mkdir server
cd server
```

2. Install dependencies:
```bash
npm install express cors helmet express-rate-limit mongoose openai @supabase/supabase-js axios dotenv
npm install --save-dev nodemon jest supertest eslint
```

3. Create `.env` file based on `.env.example` with your API keys:
```env
MONGODB_URI=mongodb://localhost:27017/farming-assistant
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### POST `/api/chat`
Send a message to the AI assistant.

**Headers:**
```
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How do I prepare soil for wheat farming?",
  "language": "en",
  "location": "Delhi" // optional
}
```

**Response:**
```json
{
  "response": "To prepare soil for wheat farming, follow these steps...",
  "timestamp": "2023-09-01T10:30:00.000Z",
  "language": "en",
  "weatherInfo": {
    "temperature": 25,
    "description": "clear sky",
    "location": "Delhi"
  }
}
```

### GET `/api/chat/history`
Retrieve chat history for the authenticated user.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Messages per page (default: 50)

### DELETE `/api/chat/history`
Clear all chat history for the authenticated user.

## Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/farming-assistant
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Client (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

## Database Schema

### ChatMessage Collection
```javascript
{
  userId: String,           // Supabase user ID
  userMessage: String,      // User's message
  assistantResponse: String, // AI response
  language: String,         // 'en' or 'hi'
  timestamp: Date,          // Message timestamp
  metadata: {
    weatherData: Object,    // Weather info at time of query
    location: String,       // User location
    responseTime: Number,   // API response time in ms
    model: String,          // AI model used
    tokensUsed: Number,     // Tokens consumed
    rating: Number,         // User satisfaction (1-5)
    flagged: Boolean        // Content moderation flag
  }
}
```

### UserSession Collection
```javascript
{
  userId: String,           // Supabase user ID
  currentLanguage: String,  // Preferred language
  lastActivity: Date,       // Last chat activity
  preferences: {
    speechEnabled: Boolean,
    location: String,
    crops: [String],
    farmSize: String
  },
  statistics: {
    totalChats: Number,
    averageRating: Number,
    favoriteTopics: [Object]
  }
}
```

## Component Props

### ChatBot Component
```jsx
<ChatBot 
  isOpen={boolean}        // Whether chat is visible
  onClose={function}      // Close handler
/>
```

### ChatBotWidget Component
```jsx
<ChatBotWidget />       // No props required - self-contained
```

## Customization

### Styling
The components use Tailwind CSS classes. Customize colors by modifying the class names:

```jsx
// Change primary color from emerald to blue
className="bg-emerald-600 hover:bg-emerald-700"
// becomes
className="bg-blue-600 hover:bg-blue-700"
```

### Language Support
Add new languages by:

1. Extending the language options in the frontend:
```jsx
<option value="ur">اردو</option>
<option value="pa">ਪੰਜਾਬੀ</option>
```

2. Adding system prompts in the backend:
```javascript
const getSystemPrompt = (language, weatherData) => {
  if (language === 'ur') {
    return 'آپ ایک مددگار زرعی ماہر ہیں...';
  }
  // ... existing prompts
};
```

### AI Model Configuration
Change the OpenAI model in the API route:
```javascript
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo', // Change from gpt-4
  // ... other options
});
```

## Error Handling

The system includes comprehensive error handling:

- **Authentication errors**: Invalid or expired tokens
- **Rate limiting**: Too many requests protection
- **API errors**: OpenAI service issues
- **Network errors**: Connection problems
- **Validation errors**: Invalid input data

## Security Features

- **CORS protection**: Configured for your domain
- **Rate limiting**: Prevents abuse
- **Input validation**: Sanitizes user messages  
- **Authentication**: Supabase JWT verification
- **Content filtering**: Optional content moderation

## Performance Optimization

- **Message caching**: Recent conversations cached
- **Response streaming**: Real-time typing effect
- **Lazy loading**: Components loaded on demand
- **Request debouncing**: Prevents duplicate calls
- **Connection pooling**: MongoDB optimization

## Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment settings

### Backend (Railway/Render/AWS)
1. Upload server code to hosting platform
2. Set environment variables
3. Ensure MongoDB connection
4. Configure CORS for your frontend domain

## Monitoring & Analytics

Track usage with:
- Chat message volume
- Response times
- User satisfaction ratings
- Popular farming topics
- Language preferences
- Error rates

## Support

For issues or questions:
1. Check the error logs in browser console
2. Verify all API keys are correctly set
3. Ensure MongoDB and Supabase connections
4. Test with simple messages first

## License

MIT License - feel free to modify and use in your projects.
