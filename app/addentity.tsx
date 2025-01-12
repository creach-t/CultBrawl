import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddEntity() {
  const handleAddMovie = () => {
    router.push('/addmovie'); // Redirige vers la page pour ajouter un film
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une Entité</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddMovie}>
        <Ionicons name="film-outline" size={24} color="white" />
        <Text style={styles.addButtonText}>Ajouter un Film</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
