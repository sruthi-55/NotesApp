import React, { useEffect, useState } from 'react';
import { fetchNotes } from '../services/NoteService';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes()
      .then(res => setNotes(res.data))
      .catch(err => {
        console.error('Error fetching notes:', err);
      });
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
      <div className="grid gap-4">
        {notes.length > 0 ? (
          notes.map(note => <NoteCard key={note.id} note={note} />)
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
