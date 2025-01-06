import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';  // Import de api.js

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        username,
        password,
      });

      if (response.token) {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Échec de la connexion.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => router.push('/signup')}
      >
        Créer un compte
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {  
    textAlign: 'center',
    marginTop: 20,
  },
});
