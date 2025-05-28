import React, { useEffect, useState } from "react";
import { fetchNotes } from "../services/NoteService";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes()
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // optional: refresh notes or reorder on pin toggle
  const handlePinToggle = (noteId) => {
    // simplest way: refetch all notes
    fetchNotes()
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err));
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => navigate("/create")}
      >
        + Create New Note
      </button>
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
      <div className="grid gap-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard key={note.id} note={note} onPinToggle={handlePinToggle} />
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
