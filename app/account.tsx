import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';

export default function Account() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState({
    firstname: false,
    lastname: false,
    email: false,
    imageUrl: false
  });

  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/1');
      setUser(response.user);
      setUpdatedUser(response.user);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleSave = async (field) => {
    try {
      const response = await api.put('/profile', {
        [field]: updatedUser[field]
      });
      setUser({ ...user, [field]: updatedUser[field] });
      handleEdit(field);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedUser({ ...updatedUser, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations du Compte</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Prénom:</Text>
        {isEditing.firstname ? (
          <TextInput
            style={styles.input}
            value={updatedUser.firstname}
            onChangeText={(text) => handleInputChange('firstname', text)}
          />
        ) : (
          <Text style={styles.text}>{user.firstname || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity onPress={() => isEditing.firstname ? handleSave('firstname') : handleEdit('firstname')}>
          <Text style={styles.editButton}>
            {isEditing.firstname ? 'Enregistrer' : 'Modifier'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nom:</Text>
        {isEditing.lastname ? (
          <TextInput
            style={styles.input}
            value={updatedUser.lastname}
            onChangeText={(text) => handleInputChange('lastname', text)}
          />
        ) : (
          <Text style={styles.text}>{user.lastname || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity onPress={() => isEditing.lastname ? handleSave('lastname') : handleEdit('lastname')}>
          <Text style={styles.editButton}>
            {isEditing.lastname ? 'Enregistrer' : 'Modifier'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email:</Text>
        {isEditing.email ? (
          <TextInput
            style={styles.input}
            value={updatedUser.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
        ) : (
          <Text style={styles.text}>{user.email || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity onPress={() => isEditing.email ? handleSave('email') : handleEdit('email')}>
          <Text style={styles.editButton}>
            {isEditing.email ? 'Enregistrer' : 'Modifier'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Image de profil:</Text>
        {isEditing.imageUrl ? (
          <TextInput
            style={styles.input}
            value={updatedUser.imageUrl}
            onChangeText={(text) => handleInputChange('imageUrl', text)}
          />
        ) : (
          <Text style={styles.text}>{user.imageUrl || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity onPress={() => isEditing.imageUrl ? handleSave('imageUrl') : handleEdit('imageUrl')}>
          <Text style={styles.editButton}>
            {isEditing.imageUrl ? 'Enregistrer' : 'Modifier'}
          </Text>
        </TouchableOpacity>
      </View>

      <Button title="Retour" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  text: {
    flex: 2,
    fontSize: 18,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  editButton: {
    flex: 1,
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
