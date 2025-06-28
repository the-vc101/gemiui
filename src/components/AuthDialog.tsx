import { useState } from 'react'
import { Key, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GoogleAuthService, GoogleAuthResult } from '@/services/googleAuthService'

interface AuthDialogProps {
  onAuthSuccess: (authType: 'apikey' | 'google-oauth', token: string, userInfo?: any) => void
  onCancel?: () => void
}

export default function AuthDialog({ onAuthSuccess, onCancel }: AuthDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  const handleApiKeyAuth = () => {
    if (!apiKey.trim()) {
      setAuthError('Please enter a valid API key')
      return
    }

    setAuthError(null)
    setAuthSuccess('API key configured successfully!')
    
    setTimeout(() => {
      onAuthSuccess('apikey', apiKey.trim())
    }, 1000)
  }

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true)
    setAuthError(null)
    setAuthSuccess(null)

    try {
      const authService = new GoogleAuthService()
      const result: GoogleAuthResult = await authService.startOAuthFlow()

      if (result.success && result.accessToken) {
        // Store auth info
        authService.storeAuth(result.accessToken, result.userInfo)
        
        setAuthSuccess(`Welcome, ${result.userInfo?.name || 'User'}!`)
        
        setTimeout(() => {
          onAuthSuccess('google-oauth', result.accessToken!, result.userInfo)
        }, 1500)
      } else {
        setAuthError(result.error || 'Google authentication failed')
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome to GemiUI</h2>
        <p className="text-muted-foreground">
          Choose your authentication method to get started
        </p>
      </div>

      {/* Error/Success Messages */}
      {authError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{authError}</span>
        </div>
      )}

      {authSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">{authSuccess}</span>
        </div>
      )}

      {/* Google OAuth */}
      <div className="mb-6">
        <Button
          onClick={handleGoogleAuth}
          disabled={isAuthenticating}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAuthenticating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <User className="h-4 w-4 mr-2" />
          )}
          {isAuthenticating ? 'Authenticating...' : 'Sign in with Google'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Recommended • Uses your Google account for secure access
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* API Key */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Gemini API Key
          </label>
          <Input
            type="password"
            placeholder="Enter your Gemini API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApiKeyAuth()}
          />
        </div>
        
        <Button
          onClick={handleApiKeyAuth}
          variant="outline"
          className="w-full"
          disabled={!apiKey.trim()}
        >
          <Key className="h-4 w-4 mr-2" />
          Use API Key
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Get your API key from{' '}
          <button
            onClick={() => window.open('https://aistudio.google.com/apikey', '_blank')}
            className="text-primary hover:underline"
          >
            Google AI Studio
          </button>
        </p>
      </div>

      {onCancel && (
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={onCancel} className="text-sm">
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}