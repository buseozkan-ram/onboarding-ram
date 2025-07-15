import './App.css'
import React from 'react'
import { AuthProvider } from 'react-oauth2-code-pkce'
import type { TAuthConfig } from 'react-oauth2-code-pkce'
import LoginStatus from './components/LoginStatus'
import Header from './components/places/Header'

function App() {

  const authConfig: TAuthConfig = {
    clientId: 'web',
    authorizationEndpoint: 'https://staging-auth.ramtracking.com/oauth2/authorize',
    tokenEndpoint: 'https://staging-auth.ramtracking.com/oauth2/token',
    redirectUri: 'http://localhost:3000/',
    decodeToken: true,
    scope: 'all',
    autoLogin: false,
    refreshTokenExpiresIn: 600000
  }

  return (
    <AuthProvider authConfig={authConfig}>
      <Header />
      <LoginStatus />
    </AuthProvider>
  )
}

export default App
