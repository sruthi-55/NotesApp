import axios from '../api/axios';

const AuthService = {
  login: async (username, password) => {
    const response = await axios.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default AuthService;
