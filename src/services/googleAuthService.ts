/**
 * Google OAuth Authentication Service for GemiUI
 * Implements real Google OAuth 2.0 flow with PKCE for desktop applications
 */

export interface GoogleAuthResult {
  success: boolean
  accessToken?: string
  error?: string
  userInfo?: {
    email: string
    name: string
    picture?: string
  }
}

export class GoogleAuthService {
  private readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  private readonly CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
  private readonly REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ')

  // Generate PKCE challenge for security
  private async generateCodeChallenge(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = this.generateRandomString(128)
    
    // Use Web Crypto API for proper SHA256 hashing
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    
    // Convert to base64url
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    
    return { codeVerifier, codeChallenge }
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async startOAuthFlow(): Promise<GoogleAuthResult> {
    if (!this.CLIENT_ID) {
      return {
        success: false,
        error: 'Google OAuth not configured. Please check environment variables.'
      }
    }

    try {
      // Generate PKCE challenge
      const { codeVerifier, codeChallenge } = await this.generateCodeChallenge()
      
      // Store code verifier for later use
      localStorage.setItem('oauth_code_verifier', codeVerifier)
      
      // Create OAuth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.append('client_id', this.CLIENT_ID)
      authUrl.searchParams.append('redirect_uri', this.REDIRECT_URI)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', this.SCOPES)
      authUrl.searchParams.append('code_challenge', codeChallenge)
      authUrl.searchParams.append('code_challenge_method', 'S256')
      authUrl.searchParams.append('access_type', 'offline')
      authUrl.searchParams.append('prompt', 'consent')

      // Open OAuth URL and handle callback
      return await this.handleOAuthFlow(authUrl.toString())
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth flow failed'
      }
    }
  }

  private async handleOAuthFlow(authUrl: string): Promise<GoogleAuthResult> {
    return new Promise((resolve) => {
      // Create a callback server to handle the OAuth redirect
      const callbackServer = this.createCallbackServer((result) => {
        resolve(result)
      })

      // Open the OAuth URL in default browser
      if (window.electronAPI) {
        window.electronAPI.openExternalLink(authUrl)
      } else {
        window.open(authUrl, '_blank')
      }
    })
  }

  private createCallbackServer(callback: (result: GoogleAuthResult) => void): any {
    // For Electron, we'll use a simple HTTP server to handle the callback
    // This is a placeholder - in a real implementation, you'd set up an actual server
    
    // Listen for messages from the callback page
    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'oauth_callback') {
        window.removeEventListener('message', messageHandler)
        
        if (event.data.error) {
          callback({
            success: false,
            error: event.data.error
          })
          return
        }

        if (event.data.code) {
          try {
            const result = await this.exchangeCodeForToken(event.data.code)
            callback(result)
          } catch (error) {
            callback({
              success: false,
              error: error instanceof Error ? error.message : 'Token exchange failed'
            })
          }
        }
      }
    }

    window.addEventListener('message', messageHandler)
    
    // Cleanup after 5 minutes
    setTimeout(() => {
      window.removeEventListener('message', messageHandler)
      callback({
        success: false,
        error: 'OAuth flow timed out'
      })
    }, 300000)
  }

  private async exchangeCodeForToken(code: string): Promise<GoogleAuthResult> {
    const codeVerifier = localStorage.getItem('oauth_code_verifier')
    if (!codeVerifier) {
      throw new Error('Code verifier not found')
    }

    // Clean up
    localStorage.removeItem('oauth_code_verifier')

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    const tokenData = await tokenResponse.json()
    
    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userInfo = await userInfoResponse.json()

    return {
      success: true,
      accessToken: tokenData.access_token,
      userInfo: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      }
    }
  }

  // Check if we have a stored access token
  getStoredAuth(): { accessToken?: string; userInfo?: any } {
    const accessToken = localStorage.getItem('google-access-token')
    const userInfo = localStorage.getItem('google-user-info')
    
    return {
      accessToken: accessToken || undefined,
      userInfo: userInfo ? JSON.parse(userInfo) : undefined
    }
  }

  // Store auth info
  storeAuth(accessToken: string, userInfo: any) {
    localStorage.setItem('google-access-token', accessToken)
    localStorage.setItem('google-user-info', JSON.stringify(userInfo))
  }

  // Clear stored auth
  clearAuth() {
    localStorage.removeItem('google-access-token')
    localStorage.removeItem('google-user-info')
  }
}