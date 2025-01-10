import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import CardBattle from '../components/cardBattle'; // Assurez-vous que le chemin est correct

interface Battle {
  id: number;
  title: string;
  category: string;
  entity1Id: {
    id: number;
    name: string;
    imageUrl: string;
  };
  entity2Id: {
    id: number;
    name: string;
    imageUrl: string;
  };
  votes: {
    entity1Votes: number;
    entity2Votes: number;
  };
  status: string; // "ongoing", "finished"
}

export default function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

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

  useEffect(() => {
    fetchBattles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchBattles();
    }, [])
  );

  const renderBattle = ({ item }: { item: Battle }) => (
    <CardBattle
      battle={item}
    />
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
      {user && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/addbattle')}
        >
          <Ionicons name="add-circle-outline" size={28} color="white" />
          <Text style={styles.addButtonText}>Lancer une Battle</Text>
        </TouchableOpacity>
      )}
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
