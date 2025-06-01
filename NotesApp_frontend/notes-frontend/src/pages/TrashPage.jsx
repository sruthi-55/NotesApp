import React, { useEffect, useState } from "react";
import { getTrashedNotes, restoreNoteById } from "../services/NoteService";
import { useNavigate } from "react-router-dom";
import styles from "./TrashPage.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.heading}>Trashed Notes</h1>
      {trashedNotes.length === 0 ? (
        <p className={styles.empty}>Trash is empty.</p>
      ) : (
        <div className={styles.grid}>
          {trashedNotes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              <h2 className={styles.title}>{note.title}</h2>
              <p className={styles.content}>
                {note.content.length > 100
                  ? note.content.substring(0, 100) + "..."
                  : note.content}
              </p>
              <div className={styles.footer}>
                <p className={styles.updated}>
                  Updated: {new Date(note.updatedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleRestore(note.id)}
                  className={styles.restoreButton}>
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
