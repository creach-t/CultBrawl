import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const CardBattle = ({ battle }) => {
  const [votes, setVotes] = useState({ entity1Votes: 0, entity2Votes: 0 });
  const [voting, setVoting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await api.get(`/battle/${battle.id}/votes`);
      const entity1Votes = response.entity1Votes;
      const entity2Votes = response.entity2Votes;
      setVotes({ entity1Votes, entity2Votes });
    } catch (error) {
      console.error('Erreur lors de la récupération des votes :', error);
    }
  };

  const handleVote = async (entityId) => {
    if (voting || battle.status !== 'pending') return;
    setVoting(true);
    try {
      console.log('user ID : ', user?.id);
      await api.post(`/battle/${battle.id}/vote`, { votedEntityId: entityId, userId: 1
       });
      fetchVotes();
    } catch (error) {
      console.error('Erreur lors du vote :', error);
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = votes.entity1Votes + votes.entity2Votes;
  const entity1Percentage = totalVotes ? Math.round((votes.entity1Votes / totalVotes) * 100) : 50;
  const entity2Percentage = totalVotes ? Math.round((votes.entity2Votes / totalVotes) * 100) : 50;

  const statusText = battle.status === 'pending' ? 'En cours' : 'Terminé';
  const statusColor = battle.status === 'pending' ? '#4caf50' : '#f44336';

  return (
    <View style={styles.card}>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, { backgroundColor: statusColor }]}>{statusText}</Text>
      </View>
      <View style={styles.voteContainer}>
        <TouchableOpacity
          style={[styles.voteSide, { flex: entity1Percentage / 100 }]}
          onPress={() => handleVote(battle.participants[0].id)}
          disabled={battle.status !== 'pending'}
        >
          <ImageBackground
            source={{ uri: battle.participants[0].imageUrl }}
            style={styles.imageBackground}
            imageStyle={styles.image}
          >
            <Text style={styles.titleOverlay}>{battle.participants[0].name}</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.voteSide, { flex: entity2Percentage / 100 }]}
          onPress={() => handleVote(battle.participants[1].id)}
          disabled={battle.status !== 'pending'}
        >
          <ImageBackground
            source={{ uri: battle.participants[1].imageUrl }}
            style={styles.imageBackground}
            imageStyle={styles.image}
          >
            <Text style={styles.titleOverlay}>{battle.participants[1].name}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={styles.percentageContainer}>
        <Text style={styles.percentage}>{entity1Percentage}%</Text>
        <Ionicons name="swap-horizontal" size={24} color="#555" />
        <Text style={styles.percentage}>{entity2Percentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: 20,
  },
  voteSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  imageBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 10,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default CardBattle;
