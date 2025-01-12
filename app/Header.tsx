import React, { useState } from 'react';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { useMessage } from '../context/MessageContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet, Animated, Easing } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Header() {
  const { user, setUser } = useUser();
  const { message } = useMessage();
  const [menuVisible, setMenuVisible] = useState(false);
  const [messageOpacity] = useState(new Animated.Value(0));

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleProfilePress = () => {
    if (user) {
      setMenuVisible(true);
    } else {
      router.push('/auth');
    }
  };

  const truncateUsername = (username) => {
    return username.length > 15 ? `${username.substring(0, 15)}...` : username;
  };

  if (message) {
    Animated.timing(messageOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);
    });
  }

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="CultBrawl" titleStyle={styles.headerTitle} />

        {user && (
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{truncateUsername(user.username)}</Text>
              <View style={styles.pointsContainer}>
                <MaterialCommunityIcons name="diamond-stone" size={16} color="#fff" />
                <Text style={styles.points}>{user.points}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="account-circle" size={40} color="#fff" onPress={handleProfilePress} />
          </View>
        )}

        {!user && (
          <Appbar.Action icon="account-circle" onPress={handleProfilePress} />
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

      {message && (
        <Animated.View
          style={[
            styles.messageContainer,
            message.type === 'error' ? styles.error : styles.success,
            { opacity: messageOpacity },
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  userDetails: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  points: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  messageContainer: {
    position: 'absolute',
    top: 60,
    left: '5%',
    right: '5%',
    zIndex: 100,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  error: {
    backgroundColor: '#f44336',
  },
  success: {
    backgroundColor: '#4caf50',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
