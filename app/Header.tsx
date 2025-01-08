import React, { useState } from 'react';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';

export default function Header() {
  const { user, setUser } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    router.push('/auth');
  };

  const handleProfilePress = () => {
    if (user) {
      setMenuVisible(true);
    } else {
      router.push('/auth');
    }
  };

  const truncateUsername = (username) => {
    return username.length > 15 ? username.substring(0, 15) + '...' : username;
  };

  return (
    <Appbar.Header>
      <Appbar.Content title="CultBrawl" />
      
      {user && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 8 }}>
            {truncateUsername(user.username)}
          </Text>
          <Appbar.Action 
            icon="account-circle" 
            onPress={handleProfilePress} 
          />
        </View>
      )}
      
      {!user && (
        <Appbar.Action 
          icon="account-circle" 
          onPress={handleProfilePress} 
        />
      )}

      {user && (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Text />}
        >
          <Menu.Item onPress={() => router.push('/account')} title="Mon Compte" />
          <Divider />
          <Menu.Item onPress={handleLogout} title="Se Déconnecter" />
        </Menu>
      )}
    </Appbar.Header>
  );
}