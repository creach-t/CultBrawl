import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { router } from 'expo-router';

export default function Battles() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    try {
      const response = await api.get('/battles');
      setBattles(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des batailles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBattlePress = (battleId) => {
    router.push(`/battle/${battleId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Batailles Disponibles</Text>
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={battles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.battleItem}
              onPress={() => handleBattlePress(item.id)}
            >
              <Text style={styles.battleText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  battleItem: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  battleText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
