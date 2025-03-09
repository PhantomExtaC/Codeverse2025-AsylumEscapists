# Nosiac3 - AI-Powered Document Editor

A Next.js-based document editor with AI capabilities, including code execution, text summarization, and AI assistance.

## Features

- Rich text editing
- Code execution and analysis
- Text summarization
- AI-powered assistance
- Firebase integration for authentication and storage

## Setup

1. Clone the repository:
```bash
git clone https://github.com/PhantomExtaC/Codeverse2025-AsylumEscapists.git
cd Codeverse2025-AsylumEscapists
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables:
     - Firebase configuration (obtain from Firebase Console)
     - AI service configuration

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

The following environment variables are required:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### AI Service Configuration
```
LM_STUDIO_API_URL=http://localhost:1234/v1/chat/completions
AI_MODEL_NAME=LLaMA v2
AI_MODEL_PARAMETERS=7B
```

## Security Notes

- Never commit the `.env` or `.env.local` files
- Keep your API keys and sensitive information secure
- Use environment variables for all sensitive configuration
- Follow security best practices when deploying

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License - See LICENSE file for details
