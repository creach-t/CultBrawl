import React, { useEffect, useState } from 'react';
import { Slot, router } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider, useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <UserProvider>
          <RootWithHeader />
        </UserProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Rendu de l'application avec Header dynamique
function RootWithHeader() {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return null;  // Éviter d'afficher avant la récupération du user
  }

  return (
    <>
      <Header />
      <Slot />  {/* Rendu des pages */}
    </>
  );
}
