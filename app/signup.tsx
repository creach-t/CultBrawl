import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';  // Import de api.js

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await api.post('/register', {
        username,
        password,
      });

      alert(response.message);  // Affiche le message du backend
      router.replace('/auth');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
      <Text
        style={styles.link}
        onPress={() => router.push('/auth')}
      >
        Déjà un compte ? Se connecter
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
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});
