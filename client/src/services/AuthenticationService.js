import Api from '@/services/Api';

export default {
  async register(credentials) {
    try {
      const response = await Api().post('register', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async login(credentials) {
    try {
      const response = await Api().post('login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async checkLoginStatus() {
    try {
      const token = sessionStorage.getItem('userToken'); // Retrieve the token from session storage
      if (!token) {
        throw new Error('Token not found');
      }
  
      const response = await Api().get('protected', {
        headers: {
          Authorization: `Bearer ${token}` // Send the token in the Authorization header
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};
