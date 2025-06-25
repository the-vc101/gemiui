import { useState, useCallback, useRef } from 'react'
import { GeminiService, GeminiConfig, StreamingResponse } from '@/services/geminiService'

interface GeminiState {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  model: string
}

export const useGemini = () => {
  const serviceRef = useRef<GeminiService | null>(null)
  const [state, setState] = useState<GeminiState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    model: 'gemini-2.5-pro'
  })

  const initialize = useCallback(async (config: GeminiConfig) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      if (!serviceRef.current) {
        serviceRef.current = new GeminiService()
      }
      
      await serviceRef.current.initialize(config)
      
      setState({
        isInitialized: true,
        isLoading: false,
        error: null,
        model: serviceRef.current.getModel()
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize Gemini'
      }))
    }
  }, [])

  const sendMessage = useCallback(async function* (message: string): AsyncGenerator<StreamingResponse> {
    if (!serviceRef.current || !state.isInitialized) {
      throw new Error('Gemini service not initialized')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const generator = await serviceRef.current.sendMessage(message)
      
      for await (const response of generator) {
        yield response
        
        if (response.type === 'error') {
          setState(prev => ({ ...prev, isLoading: false, error: response.error || 'Unknown error' }))
        } else if (response.type === 'done') {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }))
      throw error
    }
  }, [state.isInitialized])

  const clearHistory = useCallback(async () => {
    if (serviceRef.current) {
      await serviceRef.current.clearHistory()
    }
  }, [])

  const getHistory = useCallback(async () => {
    if (serviceRef.current) {
      return await serviceRef.current.getHistory()
    }
    return []
  }, [])

  return {
    ...state,
    initialize,
    sendMessage,
    clearHistory,
    getHistory,
    isReady: state.isInitialized && !state.isLoading
  }
}