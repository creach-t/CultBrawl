import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

// Crée une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: 'http://192.168.1.26:3000/api',  // Adresse de ton backend
  timeout: 5000,
});

// Intercepteur pour ajouter automatiquement le token dans les headers
api.interceptors.request.use(
  async (config) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
    return config;
  },
  (error) => {
    console.error('Erreur lors de l\'ajout du token:', error);
    return Promise.reject(error);
  }
);

// Méthodes pour les requêtes API
const apiService = {
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  post: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  put: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (endpoint, config = {}) => {
    try {
      const response = await api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Gestion des erreurs avec notification
const handleApiError = async (error) => {
  if (error.response) {
    console.error('Erreur API:', error.response.data);
    
    Toast.show({
      type: 'error',
      text1: 'Erreur API',
      text2: error.response.data.message || 'Une erreur s\'est produite.',
    });

    if (error.response.status === 403) {
      await AsyncStorage.removeItem('user');
      router.push('/auth');
    }
    
    throw new Error(error.response.data.message || 'Erreur lors de la requête.');
  } else if (error.request) {
    console.error('Aucune réponse du serveur:', error.request);

    Toast.show({
      type: 'error',
      text1: 'Erreur Réseau',
      text2: 'Aucune réponse du serveur.',
    });

    throw new Error('Aucune réponse du serveur.');
  } else {
    console.error('Erreur inattendue:', error.message);

    Toast.show({
      type: 'error',
      text1: 'Erreur Inattendue',
      text2: 'Une erreur inattendue est survenue.',
    });

    throw new Error('Erreur inattendue.');
  }
};

export default apiService;
