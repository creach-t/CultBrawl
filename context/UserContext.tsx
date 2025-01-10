import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: number;
  username: string;
  token: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User | null) => void;
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

  // Récupération de l'utilisateur depuis AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
