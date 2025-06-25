# GemiUI

A modern GUI application for Gemini CLI, built with Electron, React, and shadcn/ui.

![GemiUI Screenshot](https://via.placeholder.com/800x600?text=GemiUI+Screenshot)

## ✨ Features

- 🤖 **AI Chat Interface** - Modern chat interface powered by Gemini
- 🔧 **Tool Management** - Visual representation of all available CLI tools  
- ⚙️ **Settings Panel** - Easy configuration for API keys, models, and preferences
- 📁 **File Management** - Built-in file explorer (coming soon)
- 🎨 **Multiple Themes** - Support for various UI themes
- 💾 **Session Management** - Save and restore chat sessions
- 🔌 **MCP Integration** - Model Context Protocol server support

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gemiui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for development
npm run build

# Package for distribution
npm run dist
```

## 📁 Project Structure

```
gemiui/
├── electron/           # Electron main process
│   ├── main.ts        # Main Electron process
│   └── preload.ts     # Preload script
├── src/
│   ├── components/    # React components
│   │   ├── ui/       # shadcn/ui components
│   │   ├── ChatPanel.tsx
│   │   ├── ToolsPanel.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── Sidebar.tsx
│   ├── lib/          # Utility functions
│   ├── hooks/        # React hooks
│   ├── store/        # State management
│   └── App.tsx       # Main application
├── gemini-cli/       # Gemini CLI source code
└── dist/             # Built application
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build application
- `npm run build:vite` - Build renderer process
- `npm run build:electron` - Build main process
- `npm run type-check` - Run TypeScript checks
- `npm run lint` - Run ESLint
- `npm run pack` - Package app for testing
- `npm run dist` - Build for distribution

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Desktop**: Electron
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🔧 Configuration

### API Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Open GemiUI and go to Settings
3. Enter your API key in the "API Configuration" section
4. Select your preferred model

### Themes

GemiUI supports multiple themes:
- Default
- Dark
- Light  
- GitHub
- Dracula
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Real Gemini API integration
- [ ] File drag & drop support
- [ ] Multi-tab conversations
- [ ] Plugin system
- [ ] Markdown rendering improvements
- [ ] Export conversations
- [ ] Cloud sync

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)