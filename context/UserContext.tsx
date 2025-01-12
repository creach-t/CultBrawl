import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Assurez-vous que le service API est correctement configuré
import { router } from 'expo-router';

type User = {
  id: number;
  username: string;
  token: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  imageUrl?: string;
  roleId?: number;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l’intérieur de UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  // Récupération des informations utilisateur depuis l'API
  const refreshUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser?.token) {
        const userInfo = await api.get('/user');
        setUser({ ...userInfo, token: parsedUser.token });
      } else {
        setUser(null);
        router.push('/auth'); // Redirige vers la page de connexion si le token est manquant
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur :', error);
      setUser(null);
      await AsyncStorage.removeItem('user');
      router.push('/auth'); // Redirige vers la page de connexion si une erreur se produit
    }
  };

  // Initialisation de l'utilisateur
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
