import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

interface Battle {
  id: number;
  title: string;
  category: string;
  participants: string[];
  status: string;  // "ongoing", "finished"
}

export default function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const response = await api.get('/battle');
        setBattles(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des battles :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, []);

  const renderBattle = ({ item }: { item: Battle }) => (
    <TouchableOpacity
  style={styles.battleCard}
  onPress={() => router.push(`/battle/${item.id}`)}
>
  <Text style={styles.title}>{item.title}</Text>
  <Text style={styles.category}>Catégorie : {item.category}</Text>
  <Text style={styles.participants}>
    Participants : {item.participants.join(' vs ')}
  </Text>
  <Text
    style={[
      styles.status,
      item.status === 'ongoing' ? styles.ongoing : styles.finished
    ]}
  >
    {item.status === 'ongoing' ? 'En cours' : 'Terminé'}
  </Text>
</TouchableOpacity>

  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Chargement des battles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des Battles</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/addbattle')}
      >
        <Ionicons name="add-circle-outline" size={28} color="white" />
        <Text style={styles.addButtonText}>Lancer une Battle</Text>
      </TouchableOpacity>
      {battles?.length > 0 ? (
        <FlatList
          data={battles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBattle}
        />
      ) : (
        <View style={styles.center}>
          <Text>Aucune battle en cours.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  battleCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  participants: {
    marginTop: 10,
    fontSize: 16,
    color: '#444',
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  ongoing: {
    color: 'green',
  },
  finished: {
    color: 'red',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
