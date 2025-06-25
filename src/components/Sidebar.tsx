import { useState } from 'react'
import { Clock, Trash2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
}

export default function Sidebar() {
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      timestamp: new Date(),
      messageCount: 3,
    },
    {
      id: '2',
      title: 'Project Setup Help',
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 8,
    },
    {
      id: '3',
      title: 'Code Review',
      timestamp: new Date(Date.now() - 7200000),
      messageCount: 15,
    },
  ])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="flex h-32 flex-col border-t p-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Chats</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Clock className="h-3 w-3" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className="group flex items-center justify-between rounded-md p-2 hover:bg-accent cursor-pointer"
            >
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.messageCount} messages • {formatTime(session.timestamp)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}