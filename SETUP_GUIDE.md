# AI Training Platform - Setup Guide

This AI Training Platform is a production-ready application for training and deploying AI models. Follow this guide to complete the setup.

## Database Setup

The application uses Supabase for the database. You need to run the SQL migration to create the required tables.

### Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration file located at: `supabase/migrations/20250101000000_initial_schema.sql`

### Tables Created

The migration creates the following tables with Row Level Security (RLS) enabled:

- **profiles** - User profiles linked to auth.users
- **projects** - AI training projects with model configurations
- **notebook_cells** - Interactive notebook cells for experimentation
- **training_sessions** - Training session metrics and progress tracking
- **training_results** - Output results from training sessions

### Authentication

The database includes automatic profile creation on user signup via a trigger function.

## Environment Variables

Your `.env` file should contain:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Edge Function Setup (Optional)

For AI content generation, you need to set up the Supabase Edge Function and configure API keys.

### Deploy Edge Function

1. The edge function code is located at: `supabase/functions/generate-ai-content/index.ts`
2. Deploy it using Supabase CLI or the dashboard

### Configure API Keys

In your Supabase project secrets, add the following based on which models you want to support:

- `OPENAI_API_KEY` - For GPT models
- `ANTHROPIC_API_KEY` - For Claude models
- `DEEPSEEK_API_KEY` - For DeepSeek models
- `GOOGLE_API_KEY` - For Gemini models

## Features Implemented

### 1. Expanded AI Model Catalog (18+ models)

- **OpenAI**: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku
- **DeepSeek**: DeepSeek Coder, DeepSeek Chat
- **Meta**: Llama 3 70B, Llama 3 8B
- **Mistral AI**: Mistral Large, Medium, 7B, Mixtral 8x7B
- **Google**: Gemini Pro, Gemini Ultra
- **Cohere**: Command R+, Command

### 2. Authentication System

- Email/password authentication with Supabase
- Automatic profile creation
- Protected routes
- Sign in/Sign up screens
- Sign out functionality

### 3. Database Integration

- Full CRUD operations for projects
- Notebook cell management
- Training session tracking
- Results storage
- Type-safe service layer

### 4. User Interface

- Modern dark theme design
- Model filtering by provider
- Project management dashboard
- Settings panel with user info
- Responsive layouts

### 5. Security

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Secure authentication flow
- Protected API endpoints

## Using the Application

### First Time Setup

1. Run the database migration SQL
2. Configure environment variables
3. (Optional) Deploy edge function and configure API keys
4. Build the application: `npm run build`
5. Start development: `npm start`

### Creating a Project

1. Sign up or sign in
2. Navigate to the Models tab
3. Select an AI model from the catalog
4. Fill in project details
5. Start training

### Managing Projects

- View all projects in the Projects tab
- Track training progress
- View results
- Edit or delete projects

## Production Considerations

### Database

- The migration includes proper indexes for performance
- RLS policies ensure data isolation
- Automatic timestamps on all records

### Edge Function

- CORS headers configured for all requests
- Error handling implemented
- Supports multiple AI providers
- Token usage tracking

### API Keys

Store API keys securely as Supabase secrets. Never commit them to version control.

## Need Help?

For questions about specific implementations:

1. **Authentication**: Check `app/contexts/AuthContext.tsx`
2. **Database**: Review `app/services/database.ts`
3. **Models**: See `app/constants/models.ts`
4. **Edge Function**: Look at `supabase/functions/generate-ai-content/index.ts`

## Next Steps

Consider adding:

- Real-time updates with Supabase Realtime
- Model fine-tuning capabilities
- Export/import functionality
- Team collaboration features
- Advanced analytics dashboard
