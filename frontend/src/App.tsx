import './App.css'
import { AuthProvider } from 'react-oauth2-code-pkce'
import type { TAuthConfig } from 'react-oauth2-code-pkce'
import LoginStatus from './components/LoginStatus'
import PlacesList from './components/places/PlacesList'
import PlaceForm from './components/places/PlaceForm'
import MapView from './components/places/MapView'
import React, { useState } from 'react'

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

  const [refreshFlag, setRefreshFlag] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handlePlaceAdded = () => {
    setRefreshFlag(!refreshFlag);
  };

  const toggleView = () => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };

  return (
    <AuthProvider authConfig={authConfig}>
      <LoginStatus />
      <button onClick={toggleView}>
        Switch to {viewMode === 'list' ? 'Map' : 'List'} View
      </button>
      {viewMode === 'list' ? (
        <>
          <PlacesList key={refreshFlag.toString()} />
          <PlaceForm onPlaceAdded={handlePlaceAdded} />
        </>
      ) : (
        <MapView key={refreshFlag.toString()} />
      )}
    </AuthProvider>
  )
}

export default App
