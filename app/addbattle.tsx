import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Entity {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  apiId: string;
}

export default function AddBattle() {
  const { user } = useUser();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/entity');
      setEntities(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des entités :', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectEntity = (entity: Entity) => {
    const isSelected = selectedEntities.some((e) => e.id === entity.id);
    if (isSelected) {
      setSelectedEntities(selectedEntities.filter((e) => e.id !== entity.id));
    } else if (selectedEntities.length < 2) {
      setSelectedEntities([...selectedEntities, entity]);
    } else {
      Alert.alert('Limite atteinte', 'Vous ne pouvez sélectionner que deux entités.');
    }
  };

  const handleCreateBattle = async () => {
    if (selectedEntities.length !== 2) {
      Alert.alert('Erreur', 'Veuillez sélectionner exactement deux entités.');
      return;
    }

    try {
      const response = await api.post('/battle', {
        entity1Id: selectedEntities[0].id,
        entity2Id: selectedEntities[1].id,
        durationHours: 1,
        createdById: 1,
      });

      Alert.alert('Succès', 'Bataille créée avec succès.');
      router.push('/battlelist');  // Redirection vers la liste des batailles
    } catch (error) {
      console.error("Erreur lors de la création de la bataille :", error);
      Alert.alert("Erreur", "Impossible de créer la bataille.");
    }
  };

  const renderEntity = ({ item }: { item: Entity }) => {
    const isSelected = selectedEntities.some((e) => e.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => toggleSelectEntity(item)}
      >
        <Text style={styles.cardText}>{item.name}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#6200ee" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une Bataille</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={entities}
          keyExtractor={(item) => item.id}
          renderItem={renderEntity}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucune entité trouvée. Ajoutez des entités pour commencer une bataille.
            </Text>
          }
        />
      )}

      {selectedEntities.length === 2 && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateBattle}>
          <Text style={styles.createButtonText}>Lancer la Bataille</Text>
        </TouchableOpacity>
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
    color: '#333',
  },
  card: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cardText: {
    fontSize: 18,
  },
  createButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
