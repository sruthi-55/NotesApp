import React, { useEffect, useState } from "react";
import { getTrashedNotes, restoreNoteById } from "../services/NoteService";
import { useNavigate } from "react-router-dom";

const TrashPage = () => {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTrashedNotes()
      .then((res) => setTrashedNotes(res.data))
      .catch((err) => console.error("Failed to load trash:", err));
  }, []);

  const handleRestore = (noteId) => {
    restoreNoteById(noteId)
      .then(() => {
        setTrashedNotes(trashedNotes.filter((note) => note.id !== noteId));
        alert("Note restored!");
      })
      .catch((err) => {
        alert("Failed to restore");
        console.error(err);
      });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trashed Notes</h1>
      {trashedNotes.length === 0 ? (
        <p className="text-gray-600">Trash is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trashedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-red-50 p-4 rounded shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="mt-2 text-gray-700">
                {note.content.length > 100
                  ? note.content.substring(0, 100) + "..."
                  : note.content}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Updated: {new Date(note.updatedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleRestore(note.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
