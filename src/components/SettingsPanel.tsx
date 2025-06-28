import { useState } from 'react'
import { Settings, Key, Palette, Brain, Server, ExternalLink, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useElectron } from '@/hooks/useElectron'
import { GoogleAuthService } from '@/services/googleAuthService'

export default function SettingsPanel() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '')
  const [model, setModel] = useState(() => localStorage.getItem('gemini-model') || 'gemini-2.5-pro')
  const [theme, setTheme] = useState('default')
  const [isSaving, setIsSaving] = useState(false)
  const [authType, setAuthType] = useState(() => localStorage.getItem('auth-type') || 'apikey')
  const { openExternalLink } = useElectron()

  // Check for Google auth
  const authService = new GoogleAuthService()
  const { accessToken, userInfo } = authService.getStoredAuth()
  const isGoogleAuthenticated = !!accessToken

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Save auth type and credentials
      localStorage.setItem('auth-type', authType)
      
      if (authType === 'apikey') {
        if (apiKey) {
          localStorage.setItem('gemini-api-key', apiKey)
        } else {
          localStorage.removeItem('gemini-api-key')
        }
      }
      
      localStorage.setItem('gemini-model', model)
      
      // Reload the page to reinitialize Gemini service
      window.location.reload()
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await authService.startOAuthFlow()
      if (result.success && result.accessToken) {
        authService.storeAuth(result.accessToken, result.userInfo)
        setAuthType('google-oauth')
        localStorage.setItem('auth-type', 'google-oauth')
        window.location.reload()
      } else {
        // Show error message to user
        alert(result.error || 'Google authentication is not yet configured. Please use API key authentication.')
      }
    } catch (error) {
      console.error('Google sign-in failed:', error)
      alert('Google authentication failed. Please use API key authentication.')
    }
  }

  const handleGoogleSignOut = () => {
    authService.clearAuth()
    setAuthType('apikey')
    localStorage.setItem('auth-type', 'apikey')
    window.location.reload()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b">
        <Settings className="h-5 w-5 mr-2" />
        <h2 className="font-semibold">Settings</h2>
      </div>

      {/* Settings Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-2xl">
          {/* Authentication */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Key className="h-4 w-4" />
              <h3 className="font-medium">Authentication</h3>
            </div>
            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              
              {/* Google OAuth Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">Google Account</label>
                {isGoogleAuthenticated ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      {userInfo?.picture && (
                        <img 
                          src={userInfo.picture} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {userInfo?.name || 'Google User'}
                        </p>
                        <p className="text-xs text-green-600">
                          {userInfo?.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGoogleSignOut}
                      className="h-7 px-2 text-xs"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={handleGoogleSignIn}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign in with Google
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Secure authentication using your Google account
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-muted px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* API Key Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  API Key Authentication
                </label>
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isGoogleAuthenticated}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {isGoogleAuthenticated ? 'Using Google authentication' : 'Get your API key from Google AI Studio'}
                  </p>
                  {!isGoogleAuthenticated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExternalLink('https://aistudio.google.com/apikey')}
                      className="h-7 px-2 text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open AI Studio
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <select
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* UI Preferences */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="h-4 w-4" />
              <h3 className="font-medium">Appearance</h3>
            </div>
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Theme</label>
                <select
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="github">GitHub</option>
                  <option value="dracula">Dracula</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Behavior */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-4 w-4" />
              <h3 className="font-medium">AI Behavior</h3>
            </div>
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Temperature
                </label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls randomness in responses (0 = focused, 1 = creative)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Tokens
                </label>
                <Input
                  type="number"
                  placeholder="8192"
                  defaultValue="8192"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* MCP Servers */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Server className="h-4 w-4" />
              <h3 className="font-medium">MCP Servers</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                No MCP servers configured. Add servers to extend functionality.
              </p>
              <Button variant="outline" size="sm">
                Add MCP Server
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}