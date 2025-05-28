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


export const getNoteById = (id) => {
  const token = localStorage.getItem("token");
  return axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateNote = (id, data) => {
  const token = localStorage.getItem("token"); // or wherever you store JWT

  console.log("Updating note", id, data, "with token:", token);

  return axios.put(`${BASE_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteNoteById = (id) => {
  const token = localStorage.getItem("token"); 

  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};