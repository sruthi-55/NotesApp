import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/notes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const fetchNotes = () => {
  return axios.get(BASE_URL, getAuthHeaders());
};

export const togglePinNote = (noteId) => {
  return axios.post(`${BASE_URL}/${noteId}/pin`, null, getAuthHeaders());
};


