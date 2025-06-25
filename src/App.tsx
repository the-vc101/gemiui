import { useState } from 'react'
import { MessageSquare, Settings, FileText, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ChatPanel from '@/components/ChatPanel'
import Sidebar from '@/components/Sidebar'
import ToolsPanel from '@/components/ToolsPanel'
import SettingsPanel from '@/components/SettingsPanel'

type ActivePanel = 'chat' | 'tools' | 'settings' | 'files'

function App() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('chat')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderMainContent = () => {
    switch (activePanel) {
      case 'chat':
        return <ChatPanel />
      case 'tools':
        return <ToolsPanel />
      case 'settings':
        return <SettingsPanel />
      case 'files':
        return <div className="p-4">File Explorer (Coming Soon)</div>
      default:
        return <ChatPanel />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r bg-muted/10 transition-all duration-200`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center px-4">
            {!sidebarCollapsed && (
              <h1 className="text-lg font-semibold">GemiUI</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
          
          {/* Navigation */}
          <div className="flex-1 p-2">
            <nav className="space-y-1">
              <Button
                variant={activePanel === 'chat' ? 'secondary' : 'ghost'}
                className={`w-full ${sidebarCollapsed ? 'px-2' : 'justify-start'}`}
                onClick={() => setActivePanel('chat')}
              >
                <MessageSquare className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Chat</span>}
              </Button>
              
              <Button
                variant={activePanel === 'tools' ? 'secondary' : 'ghost'}
                className={`w-full ${sidebarCollapsed ? 'px-2' : 'justify-start'}`}
                onClick={() => setActivePanel('tools')}
              >
                <Wrench className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Tools</span>}
              </Button>
              
              <Button
                variant={activePanel === 'files' ? 'secondary' : 'ghost'}
                className={`w-full ${sidebarCollapsed ? 'px-2' : 'justify-start'}`}
                onClick={() => setActivePanel('files')}
              >
                <FileText className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Files</span>}
              </Button>
              
              <Button
                variant={activePanel === 'settings' ? 'secondary' : 'ghost'}
                className={`w-full ${sidebarCollapsed ? 'px-2' : 'justify-start'}`}
                onClick={() => setActivePanel('settings')}
              >
                <Settings className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Settings</span>}
              </Button>
            </nav>
          </div>

          {!sidebarCollapsed && <Sidebar />}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderMainContent()}
      </div>
    </div>
  )
}

export default App