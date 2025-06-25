# GemiUI Development Guide

## 🎯 Current Status

✅ **Completed Features**
- Modern Electron + React + TypeScript setup
- shadcn/ui component library integration
- Responsive chat interface with message history
- Collapsible sidebar with session management
- Tools panel showing available CLI tools
- Settings panel for configuration
- Hot reload development environment

🚧 **Next Steps**
- Integrate real Gemini API through @google/gemini-cli-core
- Implement tool execution and results display
- Add file explorer with drag & drop
- Connect settings to actual configuration system

## 🔄 Development Workflow

### Starting Development

```bash
# This will:
# 1. Compile Electron main process (TypeScript → JavaScript)
# 2. Start Vite dev server (React app on localhost:5173)
# 3. Launch Electron app
npm run dev
```

### Project Architecture

```
┌─────────────────┬─────────────────┐
│   Electron      │     React       │
│   Main Process  │   Renderer      │
│                 │                 │
│   • Window      │   • UI          │
│   • Menus       │   • Components  │
│   • IPC         │   • State       │
│   • File System │   • Hooks       │
└─────────────────┴─────────────────┘
        │                   │
        └─── Communication ──┘
             (IPC Bridge)
```

### Key Files

- `electron/main.ts` - Electron main process
- `electron/preload.ts` - IPC bridge
- `src/App.tsx` - Main React component
- `src/components/` - UI components
- `gemini-cli/` - Gemini CLI source code

## 🔌 Integrating Gemini CLI Core

### Current State
The `@google/gemini-cli-core` package is installed but not yet integrated.

### Integration Plan

1. **Create Gemini Service**
```typescript
// src/services/geminiService.ts
import { GeminiClient, Config } from '@google/gemini-cli-core'

export class GeminiService {
  private client?: GeminiClient
  
  async initialize(apiKey: string) {
    // Initialize GeminiClient with config
  }
  
  async sendMessage(message: string) {
    // Stream response from Gemini
  }
}
```

2. **Add to Electron Main Process**
```typescript
// electron/main.ts
import { GeminiService } from '../src/services/geminiService'

// Register IPC handlers for Gemini operations
ipcMain.handle('gemini-send-message', async (event, message) => {
  return await geminiService.sendMessage(message)
})
```

3. **Connect to React**
```typescript
// src/hooks/useGemini.ts
export const useGemini = () => {
  const sendMessage = async (message: string) => {
    return await window.electronAPI.geminiSendMessage(message)
  }
  
  return { sendMessage }
}
```

## 🛠️ Common Development Tasks

### Adding New UI Components

1. Create component in `src/components/`
2. Export from appropriate index file
3. Use shadcn/ui components where possible

### Adding New Tool Panels

1. Create component extending base tool interface
2. Add to `ToolsPanel.tsx` registry
3. Implement tool execution logic

### Updating Electron

1. Modify `electron/main.ts` or `electron/preload.ts`
2. Run `npm run build:electron` to compile
3. Restart dev server

### Debugging

- **React DevTools**: Available in development mode
- **Electron DevTools**: F12 or View → Toggle Developer Tools
- **Main Process**: Use `console.log` in `electron/main.ts`
- **Renderer Process**: Use browser dev tools

## 🎨 UI Development

### Design System

- **Colors**: Defined in `src/index.css` using CSS variables
- **Components**: shadcn/ui components in `src/components/ui/`
- **Layout**: Flexbox-based responsive design
- **Icons**: Lucide React icons

### Theme Support

Themes are handled via CSS variables. To add a new theme:

1. Define color variables in `src/index.css`
2. Add theme option to settings panel
3. Implement theme switching logic

## 📦 Building & Distribution

### Development Build
```bash
npm run build
```

### Production Distribution
```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist -- --mac
npm run dist -- --win
npm run dist -- --linux
```

### Build Outputs
- `dist/renderer/` - React app build
- `dist/main/` - Electron main process
- `release/` - Final packaged applications

## 🐛 Troubleshooting

### Common Issues

1. **Electron won't start**
   - Check `dist/main/main.js` exists
   - Run `npm run build:electron`

2. **React app not loading**
   - Verify Vite dev server is running on localhost:5173
   - Check for TypeScript errors

3. **IPC not working**
   - Ensure preload script is loaded
   - Check contextIsolation settings

4. **Module not found errors**
   - Clear node_modules and reinstall
   - Check import paths are correct

### Performance Tips

- Use React.memo for expensive components
- Implement virtualization for large lists
- Debounce user input
- Use Electron's process isolation features

## 🔒 Security Considerations

- Context isolation is enabled
- Node integration is disabled in renderer
- All Node.js access goes through IPC
- Validate all user inputs
- Sanitize file paths and commands