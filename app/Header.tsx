import React, { useState } from 'react';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

export default function Header() {
  const { user, setUser } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    router.push('/auth');
  };

  return (
    <Appbar.Header>
      <Appbar.Content title="CultBrawl" />

      {user ? (
        <>
          <Appbar.Content
            title={
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {user.username}
              </Text>
            }
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Appbar.Action
                icon="account-circle"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => router.push('/account')} title="Mon Compte" />
            <Divider />
            <Menu.Item onPress={handleLogout} title="Se Déconnecter" />
          </Menu>
        </>
      ) : null}
    </Appbar.Header>
  );
}
