import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import api from '../services/api';
import { useUser } from '../context/UserContext';

export default function Account() {
  const { user } = useUser();  
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState({
    firstname: false,
    lastname: false,
    email: false,
  });
  const [updatedUser, setUpdatedUser] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      router.push('/auth'); 
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user');
      setProfile(response);
      setUpdatedUser(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleSave = async (field) => {
    try {
      await api.put(`/user/${user.id}`, { [field]: updatedUser[field] });
      setProfile({ ...profile, [field]: updatedUser[field] });
      handleEdit(field);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedUser({ ...updatedUser, [field]: value });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleUploadImage(result.assets[0].uri);
    }
  };

  const handleUploadImage = async (uri) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('photo', {
        uri,
        name: `profile-${user.id}.jpg`,
        type: 'image/jpeg',
      });

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = response.fullUrl; 
      await handleSaveProfileImage(imageUrl);
      Alert.alert('Succès', 'Image de profil mise à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'image de profil.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfileImage = async (imageUrl) => {
    try {
      await api.put(`/user/${user.id}`, { imageUrl });
      setProfile({ ...profile, imageUrl });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image de profil:', error);
    }
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
          <Text style={styles.text}>{profile.firstname || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity
          onPress={() =>
            isEditing.firstname ? handleSave('firstname') : handleEdit('firstname')
          }
        >
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
          <Text style={styles.text}>{profile.lastname || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity
          onPress={() =>
            isEditing.lastname ? handleSave('lastname') : handleEdit('lastname')
          }
        >
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
          <Text style={styles.text}>{profile.email || 'Non renseigné'}</Text>
        )}
        <TouchableOpacity
          onPress={() =>
            isEditing.email ? handleSave('email') : handleEdit('email')
          }
        >
          <Text style={styles.editButton}>
            {isEditing.email ? 'Enregistrer' : 'Modifier'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Image de profil:</Text>
        <Image
          source={{ uri: profile.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        <Button title="Modifier l'image" onPress={handlePickImage} disabled={uploading} />
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});
