import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/notes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No token found in localStorage!");
    return {}; // or redirect to login
  }
  console.log(token);
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

export const getTrashedNotes = () => {
  return axios.get(`${BASE_URL}/trash`, getAuthHeaders());
};

export const restoreNoteById = (id) => {
  return axios.post(`${BASE_URL}/${id}/restore`, {}, getAuthHeaders());
};

// Get all versions of a note
export const getNoteVersions = (noteId) => {
  return axios.get(`${BASE_URL}/${noteId}/versions`,getAuthHeaders());
};

// Restore note to specific version
export const restoreNoteVersion = (noteId, versionId) => {
  return axios.post(
    `${BASE_URL}/${noteId}/versions/${versionId}/restore`,
    {},
    getAuthHeaders()
  );
};

