import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeCache } from './src/utils/cache';
import { requestNotificationPermissions } from './src/utils/notifications';

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize cache system
      await initializeCache();
      
      // Request notification permissions
      await requestNotificationPermissions();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#3498DB" />
      <AppNavigator />
    </>
  );
}

