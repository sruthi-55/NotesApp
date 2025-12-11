import React, { useEffect, useState } from "react";
import { getTrashedNotes, restoreNoteById } from "../services/NoteService";
import { useNavigate } from "react-router-dom";
import styles from "./TrashPage.module.css";
import { useOutletContext } from "react-router-dom";

const TrashPage = () => {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setNotes } = useOutletContext();

  useEffect(() => {
    const fetchTrashed = async () => {
      setIsLoading(true);
      try {
        const res = await getTrashedNotes();
        setTrashedNotes(res.data);
      } catch (err) {
        setErrorMessage("Failed to load trash", err);
      }
      setIsLoading(false);
    };
    fetchTrashed();
  }, []);

  const handleRestore = async (noteId) => {
    setIsRestoring(true);
    try {
      const res = await restoreNoteById(noteId);
      const restoredNote = res.data; 

      // remove from trash list
      setTrashedNotes((prev) => prev.filter((n) => n.id !== noteId));

      // to main notes state
      setNotes((prev) => [...prev, restoredNote]);
    } catch (err) {
      setErrorMessage("Failed to restore", err);
    }
    setIsRestoring(false);
  };

  return (
    <>
      {/* Loading / restoring / error modal */}
      {(isLoading || isRestoring || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isLoading ? (
              <>
                <div className={styles.loader}></div>
                <p>Loading notes...</p>
              </>
            ) : isRestoring ? (
              <>
                <div className={styles.loader}></div>
                <p>Restoring note...</p>
              </>
            ) : (
              <>
                <p style={{ color: "red", marginBottom: "1rem" }}>
                  {errorMessage}
                </p>
                <button
                  className={styles.closeBtn}
                  onClick={() => setErrorMessage("")}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {!isLoading && (
        <div className={styles.container}>
          <h1 className={styles.heading}>Trashed Notes</h1>

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
        </div>
      )}
    </>
  );
};

export default TrashPage;
