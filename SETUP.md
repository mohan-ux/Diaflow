# Mind Map AI - Setup Guide

This document provides instructions on how to set up and run the Mind Map AI project.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Firebase project (optional for collaboration features)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mind-map-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
     ```
   - If using Firebase, add your Firebase configuration:
     ```
     REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
     REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
     REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
     ```

## Running the Application

Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

The project follows a modular structure:

```
src/
├── components/       # UI components
│   ├── Canvas/       # Main diagram editor
│   ├── LeftPanel/    # Shape library and tools
│   ├── RightPanel/   # AI assistant
│   ├── BottomPanel/  # Properties panel
│   └── common/       # Reusable components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── services/         # API services
├── store/            # State management
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Development Workflow

1. **Phase 1: Core Canvas Functionality**

   - Implement the canvas with React Flow or Konva
   - Add basic shape manipulation

2. **Phase 2: Panels and UI**

   - Implement the left panel with shape library
   - Create the properties panel
   - Polish the UI

3. **Phase 3: AI Integration**

   - Connect to OpenAI API
   - Implement text-to-diagram conversion
   - Add code-to-diagram functionality

4. **Phase 4: Collaboration and Export**
   - Set up Firebase for real-time collaboration
   - Add export functionality

See the `ROADMAP.md` file for a detailed development plan.

## Troubleshooting

### OpenAI API Issues

- Ensure your API key is correct and has sufficient credits
- Check the OpenAI service status at [status.openai.com](https://status.openai.com)
- Verify that you're using the correct API endpoints and parameters

### Firebase Issues

- Confirm that your Firebase project is properly set up
- Ensure that Firestore and Authentication services are enabled
- Check that your security rules allow the necessary operations

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

Please follow the coding standards and write tests for new features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
