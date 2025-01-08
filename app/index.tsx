import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function Index() {
  const { user } = useUser();  // Récupère l'utilisateur depuis le contexte

  useEffect(() => {
    if (user) {
      console.log('Utilisateur connecté:', user);
    } else {
      console.log('Aucun utilisateur connecté');
    }
  }, [user]);  // Relance l'effet lorsque l'utilisateur change

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur CultBrawl!</Text>
      <Text style={styles.description}>
        CultBrawl est un jeu de versus où les films, séries et livres s'affrontent. Votez pour vos favoris,
        créez des batailles épiques et gravissez les échelons !
      </Text>

      {!user && (  // Affiche le message uniquement si l'utilisateur n'est pas connecté
        <TouchableOpacity onPress={() => router.push('/auth')}>
          <Text style={styles.info}>
            Connectez-vous pour rejoindre les batailles et participer aux votes.{' '}
            <Text style={styles.link}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    color: 'blue',
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
  },
});
