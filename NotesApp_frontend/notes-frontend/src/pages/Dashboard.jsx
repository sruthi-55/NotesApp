import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import styles from "./Dashboard.module.css";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { notes, setNotes, isLoading, onPinToggle } = useOutletContext();
  const navigate = useNavigate();

  const handleNoteDeleted = (deletedId) => {
    const updated = notes.filter((note) => note.id !== deletedId);
    setNotes(updated);
  };

  return (
    <div className={styles.pageWrapper}>
      <button
        className={styles.createButton}
        onClick={() => navigate("/create")}>
        + Create New Note
      </button>

      <div className={styles.notesGrid}>
        {isLoading && <p>Loading your notes...</p>}
        {!isLoading && notes.length === 0 && <p>No notes found.</p>}

        {!isLoading &&
          notes.length > 0 &&
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPinToggle={onPinToggle} // parent's onPinToggle
              onDelete={handleNoteDeleted}
            />
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
