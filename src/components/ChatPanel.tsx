import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useGemini } from '@/hooks/useGemini'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const { 
    isInitialized, 
    isLoading, 
    error: geminiError, 
    model,
    initialize,
    sendMessage,
    isReady 
  } = useGemini()

  // Initialize Gemini service when component mounts
  useEffect(() => {
    if (!isInitialized) {
      // Try to get API key from localStorage or prompt user
      const savedApiKey = localStorage.getItem('gemini-api-key')
      if (savedApiKey) {
        initialize({
          apiKey: savedApiKey,
          model: 'gemini-2.5-pro'
        }).catch(console.error)
      } else {
        // Show welcome message asking for API key
        setMessages([{
          id: '1',
          type: 'system',
          content: 'Welcome to GemiUI! Please configure your Gemini API key in Settings to start chatting.',
          timestamp: new Date(),
        }])
      }
    }
  }, [isInitialized, initialize])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isReady) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const messageContent = inputValue.trim()
    setInputValue('')
    setCurrentStreamingMessage('')

    try {
      const generator = sendMessage(messageContent)
      let fullResponse = ''
      
      for await (const response of generator) {
        if (response.type === 'content' && response.content) {
          fullResponse += response.content
          setCurrentStreamingMessage(fullResponse)
        } else if (response.type === 'error') {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'system',
            content: `Error: ${response.error}`,
            timestamp: new Date(),
          }])
          setCurrentStreamingMessage('')
          return
        } else if (response.type === 'done') {
          // Add the complete assistant message
          if (fullResponse) {
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: fullResponse,
              timestamp: new Date(),
            }])
          }
          setCurrentStreamingMessage('')
          return
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date(),
      }])
      setCurrentStreamingMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b">
        <Bot className="h-5 w-5 mr-2" />
        <h2 className="font-semibold">Chat with Gemini</h2>
        <div className="ml-auto flex items-center space-x-2">
          {geminiError && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <div className={`h-2 w-2 rounded-full ${
            geminiError ? 'bg-red-500' : 
            isLoading ? 'bg-yellow-500' : 
            isReady ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-muted-foreground">
            {geminiError ? 'Error' :
             isLoading ? 'Thinking...' : 
             isReady ? `Ready (${model})` : 'Not configured'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'assistant'
                    ? 'bg-muted'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : message.type === 'assistant' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  '!'
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {message.type === 'user' ? 'You' : message.type === 'assistant' ? 'Gemini' : 'System'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-12'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {(isLoading || currentStreamingMessage) && (
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Gemini</span>
                  <span className="text-xs text-muted-foreground">
                    {currentStreamingMessage ? 'responding...' : 'typing...'}
                  </span>
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  {currentStreamingMessage ? (
                    <div className="whitespace-pre-wrap">{currentStreamingMessage}</div>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !isReady}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}