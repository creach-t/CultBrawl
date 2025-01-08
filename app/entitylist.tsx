import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface Entity {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  apiId: string;
}

export default function EntityList() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/entity');
      if (response) {
        setEntities(response);
      } else {
        setEntities([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des entités :', error);
    } finally {
      setLoading(false);
    }
  };

  // Utilisation de useFocusEffect pour recharger à chaque fois que la page est affichée
  useFocusEffect(
    useCallback(() => {
      fetchEntities();
    }, [])
  );

  const renderEntity = ({ item }: { item: Entity }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.poster}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.year}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des Entités</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/addmovie')}
      >
        <Ionicons name="add-circle-outline" size={28} color="white" />
        <Text style={styles.addButtonText}>Ajouter une Entité Film</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={entities}
          keyExtractor={(item) => item.id}
          renderItem={renderEntity}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucun résultat trouvé. Essayez une autre recherche.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  year: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
