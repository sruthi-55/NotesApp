import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteService from '../services/NoteService';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
  try {
    const response = await NoteService.getAllNotes();
    console.log('Fetched notes response:', response); // 👈 this will show us the exact structure
    setNotes(Array.isArray(response) ? response : []);
  } catch (error) {
    console.error('Failed to fetch notes', error);
    setNotes([]);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await NoteService.deleteNote(id);
      fetchNotes(); 
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Notes</h2>
      <button onClick={() => navigate('/notes/new')}>+ New Note</button>
      <ul>
        {notes.map(note => (
          <li key={note.id} style={{ margin: '10px 0' }}>
            <div
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              {note.title}
            </div>
            <button onClick={() => navigate(`/notes/edit/${note.id}`)}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
