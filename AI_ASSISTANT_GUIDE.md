# AI Assistant Usage Guide

## Overview

The AI Assistant is now fully integrated with ChatGPT and supports both authenticated and unauthenticated users with smart doctor recommendations.

## Key Features

### 1. **No Login Required for Basic Chat**
- Users can chat with the AI assistant without logging in
- Get general health information and wellness advice
- Ask questions about symptoms, nutrition, exercise, etc.

### 2. **Smart Doctor Recommendations**
When users ask about finding a doctor or mention medical specialties, the AI will:
- **For Unauthenticated Users**: Prompt them to log in to view doctor recommendations
- **For Authenticated Users**: Query the database and recommend suitable doctors based on:
  - Specialty match
  - Years of experience
  - Availability (telemedicine or clinic)
  - Languages spoken
  - Consultation fees

### 3. **Contextual Login Prompts**
The chat interface shows a login banner when:
- User asks about doctors or booking appointments
- User needs to access personalized features

## How It Works

### Detection Keywords

The AI detects doctor-related requests using keywords like:
- "doctor", "specialist", "physician"
- Specific specialties: "cardiologist", "dermatologist", "pediatrician", etc.
- "find a doctor", "recommend a doctor", "need a doctor"

### Doctor Recommendation Process

1. **User asks about doctors** (e.g., "I need a cardiologist")
2. **System checks authentication**:
   - **Not logged in**: Shows login prompt
   - **Logged in**: Queries database for matching doctors
3. **AI provides recommendations** with:
   - Doctor's name and specialty
   - Years of experience
   - Availability (telemedicine/clinic)
   - Consultation fees
4. **User can book** through the platform

## Usage Examples

### Example 1: General Health Query (No Login)
```
User: "What are some tips for better sleep?"
AI: Provides sleep hygiene tips and advice
```

### Example 2: Finding a Doctor (Not Logged In)
```
User: "I need a cardiologist"
AI: "I'd be happy to help you find the right doctor! However, to view
     and book appointments with our doctors, you'll need to create an
     account or log in."
[Login button appears]
```

### Example 3: Finding a Doctor (Logged In)
```
User: "I need a cardiologist"
AI: "Based on your needs, here are our top cardiologists:

1. Dr. Ahmed Hassan - Cardiology (Interventional Cardiology), 15 years
   experience, Available for telemedicine, Clinic: AED 350

2. Dr. Sarah Wilson - Cardiology, 12 years experience, Clinic: AED 300

I recommend Dr. Ahmed Hassan for his extensive experience in interventional
cardiology. You can book an appointment through the platform."
```

## Integration in Your App

### Basic Integration
```tsx
import { AIChat } from '../components/AIChat';

function YourPage() {
  return (
    <div style={{ height: '600px' }}>
      <AIChat onLoginClick={() => window.location.href = '/login'} />
    </div>
  );
}
```

### With Router Navigation
```tsx
import { AIChat } from '../components/AIChat';
import { useNavigation } from '../Router';

function YourPage() {
  const { navigate } = useNavigation();

  return (
    <div style={{ height: '600px' }}>
      <AIChat onLoginClick={() => navigate('/login')} />
    </div>
  );
}
```

### Landing Page Integration (Guest Access)
```tsx
import { AIChat } from '../components/AIChat';

function LandingPage() {
  return (
    <section>
      <h2>Try Our AI Health Assistant</h2>
      <p>Get instant health advice - no login required!</p>
      <div style={{ height: '500px', maxWidth: '600px' }}>
        <AIChat onLoginClick={() => window.location.href = '/signup'} />
      </div>
    </section>
  );
}
```

## Technical Details

### Edge Function
- **Location**: `supabase/functions/ai-chat/index.ts`
- **Authentication**: Optional (JWT not required)
- **Model**: GPT-3.5-turbo
- **Max tokens**: 500 per response

### Database Query
The AI queries the `doctors` table with joins to `profiles` to get:
- Doctor details (specialty, experience, fees)
- Profile information (name)
- Up to 5 doctors per query
- Sorted by years of experience

### Props

**AIChat Component**
```tsx
interface AIChatProps {
  onLoginClick?: () => void;  // Callback when user clicks login button
}
```

**useAIChat Hook**
```tsx
interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  requiresLogin: boolean;  // True when login is needed
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}
```

## Best Practices

1. **Always provide onLoginClick handler** to enable seamless authentication flow
2. **Set appropriate height** for the chat container (minimum 400px recommended)
3. **Consider placement** - works well in sidebars, dedicated pages, or modals
4. **Monitor API usage** - each message costs API tokens
5. **Test both flows** - authenticated and unauthenticated user experiences

## Customization

### Modify System Prompt
Edit `supabase/functions/ai-chat/index.ts` to change AI behavior:
```typescript
const systemMessage: ChatMessage = {
  role: "system",
  content: `Your custom instructions here...`
};
```

### Add More Detection Keywords
Edit the `detectDoctorRequest` function to recognize additional patterns.

### Customize Doctor Query
Modify the `getDoctorRecommendations` function to filter by additional criteria.

## Privacy & Security

- No login required for basic health questions
- Doctor data only shown to authenticated users
- All API calls go through Supabase edge functions
- OpenAI API key stored securely as environment variable
- Chat history stored in component state (not persisted)

## Future Enhancements

Potential features to add:
- Save chat history to database for logged-in users
- Add appointment booking directly from chat
- Support for multiple languages
- Voice input/output
- Image analysis for symptoms
- Integration with patient health records
