# AI Training Platform

A powerful, intuitive React Native mobile app that allows users to train and fine-tune Large Language Models (LLMs) without writing any code. Built with Expo, Supabase, and OpenAI integration.

## Features

- **Model Selection**: Choose from 8+ popular LLM models (GPT-4, Claude, Llama, Mistral, etc.)
- **No-Code Interface**: Simple form-based project creation with natural language goal definition
- **Jupyter-Style Notebook**: Interactive notebook interface for testing and iterating
- **Real-Time Training**: Monitor training progress with live metrics and token usage
- **Project Management**: Save and manage multiple training projects
- **Advanced Settings**: Fine-tune temperature, max tokens, and other model parameters
- **Results Dashboard**: View training outputs with quality scores and export capabilities

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Database, Storage, Edge Functions)
- **AI Integration**: OpenAI API via Supabase Edge Functions
- **Navigation**: Expo Router with tab-based navigation
- **Styling**: React Native StyleSheet with custom dark theme

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device:
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

## Project Structure

- `/app/(tabs)` - Main tab screens (Home, Models, Create, Notebook, Training, Projects, Settings, Results)
- `/app/components` - Reusable UI components
- `/app/constants` - Model configurations and constants
- `/app/lib` - Supabase client configuration

## Database Schema

- **projects**: User training projects with goals and model selection
- **training_sessions**: Training progress and metrics
- **notebook_cells**: Jupyter-style notebook cells with code and outputs

## Usage

1. **Browse Models**: Explore available LLM models with specs and pricing
2. **Create Project**: Define your training goal in plain English
3. **Upload Data**: Paste training data (CSV, JSON, or text)
4. **Use Notebook**: Test prompts and iterate in the interactive notebook
5. **Start Training**: Monitor progress and token usage in real-time
6. **View Results**: Analyze outputs with quality scores and export data

## Environment Variables

The app uses Supabase Edge Functions with the following secrets:
- `OPENAI_API_KEY`: For OpenAI API access

## License

Private project - All rights reserved
