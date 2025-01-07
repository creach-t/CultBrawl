import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  // Validation du mot de passe
  const validatePassword = (text) => {
    setPassword(text);
    const length = text.length >= 8;
    const uppercase = /[A-Z]/.test(text);
    const number = /\d/.test(text);
    const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(text);

    setRules({
      length,
      uppercase,
      number,
      specialChar,
    });
  };

  // Vérification de la disponibilité du nom d'utilisateur
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);  // Timeout pour la recherche différée
  
  const checkUsername = (text) => {
    setUsername(text);
    setUsernameAvailable(null);  // Réinitialisation à l'état neutre

    if (typingTimeout) {
      clearTimeout(typingTimeout);  // Annule le précédent timeout si l'utilisateur continue de taper
    }

    if (text.length > 0) {
      setLoading(true);  // Affiche le spinner immédiatement

      const timeout = setTimeout(async () => {
        try {
          const response = await api.get(`/auth/check-username?username=${text}`);
          
          if (response.message === 'Nom d’utilisateur disponible.') {
            setUsernameAvailable(true);
          } else {
            setUsernameAvailable(false);
          }
        } catch (err) {
          setUsernameAvailable(false);  // En cas d'erreur, on considère que le nom est indisponible
        } finally {
          setLoading(false);  // Cache le spinner après la réponse
        }
      }, 1000);  // Timeout de 1 seconde

      setTypingTimeout(timeout);  // Stocke le timeout actuel
    } else {
      setUsernameAvailable(null);  // Si le champ est vide
      setLoading(false);
    }
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  // Affichage des messages utilisateur
  const showMessage = (text, type = 'error') => {
    setMessage(text);
    setMessageType(type);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setMessage('');
        });
      }, 3000);
    });
  };

  // Gestion de l'inscription
  const handleSignUp = async () => {
    if (!username || !password || !isPasswordValid) {
      showMessage("Veuillez remplir tous les champs et respecter les règles.");
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        username,
        password,
      });

      if (response && response.message) {
        showMessage(response.message, 'success');
        setTimeout(() => {
          router.replace('/auth');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.message || 'Erreur lors de la création du compte.';
      showMessage(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {message !== '' && (
        <Animated.View
          style={[
            styles.messageBox,
            messageType === 'success' ? styles.successBox : styles.errorBox,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
      )}

      {usernameAvailable === false && (
        <Text style={styles.errorText}>Nom d'utilisateur déjà pris.</Text>
      )}
      {usernameAvailable === true && (
        <Text style={styles.successText}>Nom d'utilisateur disponible.</Text>
      )}

<TextInput
  style={[
    styles.input,
    username.length > 0 && username.length < 3
      ? styles.inputInvalid  // Si l'username est inférieur à 3 caractères, la bordure devient rouge
      : usernameAvailable === true
      ? styles.inputValid
      : usernameAvailable === false
      ? styles.inputInvalid
      : {},
  ]}
  placeholder="Nom d'utilisateur"
  value={username}
  onChangeText={checkUsername}
  autoCapitalize="none"
/>
{username.length > 0 && username.length < 3 && (
  <Text style={styles.errorText}>Le nom d'utilisateur doit contenir au moins 3 caractères.</Text>
)}
      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="small" color="#6200ee" />
        </View>
      )}


<View
  style={[
    styles.passwordContainer,
    !isPasswordValid && password.length > 0 ? styles.inputInvalid : {},
  ]}
>
  <TextInput
    style={styles.passwordInput}
    placeholder="Mot de passe"
    value={password}
    onChangeText={validatePassword}
    secureTextEntry={!showPassword}
    autoCapitalize="none"
  />
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    style={styles.eyeIcon}
  >
    <Ionicons
      name={showPassword ? 'eye-off' : 'eye'}
      size={24}
      color="gray"
    />
  </TouchableOpacity>
</View>

      <View style={styles.rulesContainer}>
        <Text style={[styles.rule, rules.length ? styles.valid : styles.invalid]}>
          • Au moins 8 caractères
        </Text>
        <Text style={[styles.rule, rules.uppercase ? styles.valid : styles.invalid]}>
          • Une majuscule
        </Text>
        <Text style={[styles.rule, rules.number ? styles.valid : styles.invalid]}>
          • Un chiffre
        </Text>
        <Text style={[styles.rule, rules.specialChar ? styles.valid : styles.invalid]}>
          • Un caractère spécial
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, (!isPasswordValid || usernameAvailable === false) && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={!isPasswordValid || usernameAvailable === false}
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.linkText}>
                Déjà inscrit ?{' '}
                <Text style={styles.linkHighlight}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
  },
  linkHighlight: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  rulesContainer: {
    marginBottom: 20,
  },
  rule: {
    fontSize: 12,
    marginVertical: -2,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  messageBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#FFCDD2',
    borderColor: '#D32F2F',
  },
  successBox: {
    backgroundColor: '#C8E6C9',
    borderColor: '#388E3C',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
  inputValid: {
    borderColor: 'green',
  },
  inputInvalid: {
    borderColor: 'red',
  },
  successText: {
    color: 'green',
    marginTop: -10,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
  },
});
