# AI Chat Integration Guide

The ChatGPT-powered AI Assistant has been successfully integrated into your healthcare platform.

## What Was Created

### 1. Edge Function (`supabase/functions/ai-chat/index.ts`)
- Deployed Supabase Edge Function that connects to OpenAI's ChatGPT API
- Handles authentication and CORS
- Provides healthcare-specific system prompt
- Includes patient context for personalized responses

### 2. React Hook (`src/hooks/useAIChat.ts`)
- Custom hook for managing AI chat state
- Handles message sending and receiving
- Manages loading states and errors
- Integrates with Supabase authentication

### 3. React Component (`src/components/AIChat.tsx`)
- Beautiful, fully-styled chat interface
- Dark mode support
- Loading indicators
- Automatic scrolling to latest messages
- Responsive design

## How to Use in Your Dashboard

### Option 1: Add to Patient Portal

In your `PatientPortal.tsx` or patient dashboard component:

```tsx
import { AIChat } from '../components/AIChat';

// Inside your component:
<div style={{ height: '600px' }}>
  <AIChat />
</div>
```

### Option 2: Add as Modal/Drawer

```tsx
import { useState } from 'react';
import { AIChat } from '../components/AIChat';

function YourComponent() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <button onClick={() => setShowChat(true)}>
        AI Assistant
      </button>

      {showChat && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          zIndex: 1000,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        }}>
          <AIChat />
        </div>
      )}
    </>
  );
}
```

### Option 3: Add to Sidebar

```tsx
// In your layout component
<div style={{
  gridTemplateColumns: '220px 1fr 350px',
  display: 'grid',
  gap: 20
}}>
  <Sidebar />
  <MainContent />
  <div style={{ height: 'calc(100vh - 100px)' }}>
    <AIChat />
  </div>
</div>
```

## Features

✅ **ChatGPT Integration**: Powered by OpenAI's GPT-3.5-turbo model
✅ **Personalized**: Uses patient name and context for better responses
✅ **Secure**: JWT authentication required, runs on Supabase edge function
✅ **Healthcare-Focused**: System prompt tuned for health assistance
✅ **Dark Mode**: Automatically adapts to your theme
✅ **Responsive**: Works on all screen sizes
✅ **Error Handling**: Graceful error messages and retry capability

## Configuration

The edge function is already deployed and configured. The OpenAI API key is managed securely through Supabase environment variables.

## Important Notes

1. **Medical Disclaimer**: The AI assistant is configured to never diagnose or prescribe. It always recommends consulting healthcare professionals.

2. **Rate Limiting**: Consider implementing rate limiting if needed to control API costs.

3. **Conversation History**: Currently stores conversation in component state. For persistence, you could save to Supabase database.

4. **Customization**: You can modify the system prompt in `supabase/functions/ai-chat/index.ts` to adjust the AI's behavior.

## API Costs

- Using GPT-3.5-turbo model (cost-effective)
- Maximum 500 tokens per response
- Monitor usage in OpenAI dashboard

## Next Steps

1. Add the `<AIChat />` component to your desired page
2. Test the integration
3. Optionally customize the system prompt for your specific needs
4. Consider adding conversation persistence to database
5. Add analytics to track usage

## Example: Full Dashboard Integration

```tsx
import { AIChat } from '../components/AIChat';
import { useNavigation } from '../Router';

export default function PatientPortal() {
  const [showAI, setShowAI] = useState(false);

  return (
    <PatientLayout activeNav="home">
      <div style={{ padding: 32 }}>
        {/* Your dashboard content */}

        {/* AI Chat Section */}
        <div style={{
          marginTop: 32,
          height: '500px',
          maxWidth: '800px',
          margin: '32px auto 0'
        }}>
          <h2 style={{ marginBottom: 16 }}>AI Health Assistant</h2>
          <AIChat />
        </div>
      </div>
    </PatientLayout>
  );
}
```

## Troubleshooting

- **"You must be logged in"**: Ensure user is authenticated via Supabase
- **API errors**: Check Supabase logs for edge function errors
- **No response**: Verify OPENAI_API_KEY is configured in Supabase

Enjoy your new AI-powered health assistant! 🚀
