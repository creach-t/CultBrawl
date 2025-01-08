import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function Leaderboard() {
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [entityLeaderboard, setEntityLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const userResponse = await api.get('/user/leaderboard');
        //const entityResponse = await api.get('/entity/leaderboard');
        const entityResponse = await api.get('/entity');
        
        setUserLeaderboard(userResponse);
        setEntityLeaderboard(entityResponse);
      } catch (error) {
        console.error("Erreur lors de la récupération du leaderboard :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderUserItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{index + 1}.</Text>
      <Text style={styles.name}>{item.username}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  const renderEntityItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{index + 1}.</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.points}>{item.votes} votes</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <Text style={styles.sectionTitle}>Top Joueurs</Text>
      <FlatList
        data={userLeaderboard}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.sectionTitle}>Top Entités</Text>
      <FlatList
        data={entityLeaderboard}
        renderItem={renderEntityItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#6200ee',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  name: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
  },
  points: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
