# LocalAI 🤖 &nbsp;<img src="https://visitor-badge.laobi.icu/badge?page_id=jorge-lopz.localai">

**Private network of users with access to a local LLM connected API**

A sleek and intuitive Angular-based chat interface that connects to your local LLM server, bringing the power of AI to your private network without sending data to external services.

<br>

## 🚀 Features

- 💬 **Real-time Chat**: Seamless conversation with your local LLM models with streaming responses
- 🔄 **Model Switching**: Easily switch between different AI models on the fly
- 💾 **Conversation History**: Automatic local storage of chat conversations
- 📤 **Export Functionality**: Export your chat history as JSON for backup or analysis
- 🌐 **Flexible Server Configuration**: Connect to any local LLM API endpoint
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support
- ⚡ **Fast & Private**: All data stays on your local network

<br>

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- A local LLM API server running (compatible with the `/models` and `/generate` endpoints)

<br>

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Jorge-lopz/LocalAI.git
cd LocalAI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

<br>

## 🎯 Usage

1. **Set Your API URL**: Click the "URL" button in the top-right corner and enter your local LLM server address

2. **Select a Model**: Choose from the available models in the dropdown menu

3. **Start Chatting**: Type your message in the input field and press Enter or click the send button

4. **Export Conversations**: Use the export button to save your chat history

5. **Clear History**: Click the clear button to start fresh (this will remove all saved conversations)

<br>

## 🏗️ Build for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

<br>

## 🔧 Tech Stack

- **Frontend Framework**: Angular 19
- **Language**: TypeScript
- **UI Framework**: Bootstrap 5
- **Styling**: CSS with dark mode support
- **Markdown Rendering**: ngx-markdown, marked, highlight.js
- **Server-Side Rendering**: Angular SSR
- **HTTP Client**: Native Fetch API
- **Storage**: Browser LocalStorage

<br>

## 📝 API Compatibility

Your local LLM server should implement the following endpoints:

- `GET /models` - Returns available models
- `POST /generate` - Accepts prompts and returns streaming responses

<br>

## 🧪 Development

Run unit tests:
```bash
npm test
```

Run in watch mode:
```bash
npm run watch
```

<br>

## 📦 Project Structure

```
LocalAI/
├── src/
│   ├── app/
│   │   ├── components/     # UI components (chat, bubble)
│   │   ├── services/       # Data services and API calls
│   │   ├── model/          # TypeScript interfaces
│   │   └── app.module.ts   # Main app module
│   ├── index.html          # Entry HTML
│   └── main.ts             # Bootstrap file
├── public/                 # Static assets
├── package.json            # Dependencies
└── angular.json            # Angular configuration
```

<br>

<div align="center">
  
[![wakatime](https://wakatime.com/badge/user/43299b95-37b5-4319-89dd-7bbef7fb1dcb/project/018ee2af-ffe8-4a00-9597-ce8db6ccb8a1.svg)](https://wakatime.com/badge/user/43299b95-37b5-4319-89dd-7bbef7fb1dcb/project/018ee2af-ffe8-4a00-9597-ce8db6ccb8a1)

Made with 💚 by [Jorge Lopez](https://github.com/Jorge-lopz)

</div>
