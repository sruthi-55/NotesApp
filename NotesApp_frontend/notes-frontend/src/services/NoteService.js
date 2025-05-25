import axios from 'axios';

const getAllNotes = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('/notes', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

const deleteNote = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete('/notes/${id}', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default {
  getAllNotes,
  deleteNote
};
