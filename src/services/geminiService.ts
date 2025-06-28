/**
 * Gemini Service for real AI interactions
 * Using Google GenAI SDK directly to avoid dependency conflicts
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

export interface GeminiConfig {
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
  authType?: 'apikey' | 'google-oauth'
  accessToken?: string
}

export interface StreamingResponse {
  type: 'content' | 'error' | 'done'
  content?: string
  error?: string
}

export class GeminiService {
  private genAI?: GoogleGenerativeAI
  private model?: any
  private chatHistory: any[] = []
  private isInitialized = false
  private currentModel = 'gemini-2.5-pro'

  async initialize(geminiConfig: GeminiConfig): Promise<void> {
    const authType = geminiConfig.authType || 'apikey'
    
    if (authType === 'apikey' && !geminiConfig.apiKey) {
      throw new Error('API key is required for API key authentication')
    }
    
    if (authType === 'google-oauth' && !geminiConfig.accessToken) {
      throw new Error('Access token is required for Google OAuth authentication')
    }

    try {
      // Initialize Google GenAI with appropriate auth method
      const authToken = authType === 'google-oauth' ? geminiConfig.accessToken : geminiConfig.apiKey
      this.genAI = new GoogleGenerativeAI(authToken!)
      this.currentModel = geminiConfig.model || 'gemini-2.5-pro'
      
      // Get the generative model
      this.model = this.genAI.getGenerativeModel({ 
        model: this.currentModel,
        generationConfig: {
          temperature: geminiConfig.temperature || 0.7,
          maxOutputTokens: geminiConfig.maxTokens || 8192,
        }
      })

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error)
      throw new Error(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async sendMessage(message: string): Promise<AsyncGenerator<StreamingResponse>> {
    if (!this.isInitialized || !this.model) {
      throw new Error('Gemini service not initialized')
    }

    const self = this
    return (async function* () {
      try {
        // Start a chat session or use existing history
        const chat = self.model.startChat({
          history: self.chatHistory
        })

        // Send message and get streaming response
        const result = await chat.sendMessageStream(message)

        let fullResponse = ''
        
        for await (const chunk of result.stream) {
          const chunkText = chunk.text()
          if (chunkText) {
            fullResponse += chunkText
            yield {
              type: 'content' as const,
              content: chunkText
            }
          }
        }

        // Add to chat history
        if (fullResponse) {
          self.chatHistory.push(
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: fullResponse }] }
          )
        }

        yield {
          type: 'done' as const
        }

      } catch (error) {
        console.error('Error sending message:', error)
        yield {
          type: 'error' as const,
          error: error instanceof Error ? error.message : 'Failed to send message'
        }
      }
    })()
  }

  async getHistory() {
    return this.chatHistory
  }

  async clearHistory() {
    this.chatHistory = []
  }

  isReady(): boolean {
    return this.isInitialized && !!this.model
  }

  getModel(): string {
    return this.currentModel
  }
}