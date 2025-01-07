import axios from 'axios';

// Crée une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: 'http://192.168.1.26:3000/api',  // Adresse de ton backend
  timeout: 5000,
});

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

  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Gestion des erreurs
const handleApiError = async (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      await AsyncStorage.removeItem('user');  // Déconnexion automatique
      router.push('/auth');  // Redirection vers l'écran de connexion
    }
    throw new Error(error.response.data.message || 'Erreur lors de la requête.');
  } else if (error.request) {
    throw new Error('Aucune réponse du serveur.');
  } else {
    throw new Error('Erreur inattendue.');
  }
};


export default apiService;
