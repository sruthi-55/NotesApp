import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import styles from "./SidebarLayout.module.css";
import { fetchNotes } from "../services/NoteService";
import { Outlet } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [isNotesDataLoading, setIsNotesDataLoading] = useState(true);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path) ? styles.active : "";

  // Ffetch notes once
  useEffect(() => {
    setIsNotesDataLoading(true);
    fetchNotes()
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err))
      .finally(() => setIsNotesDataLoading(false));
  }, []);

  // updates notes AND reorders pinned notes
  const handlePinToggle = (noteId) => {
    setNotes((prevNotes) => {
      // toggle pinned
      const updatedNotes = prevNotes.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
      );

      // sort pinned notes to top
      updatedNotes.sort((a, b) => {
        if (a.pinned === b.pinned) return 0;
        return a.pinned ? -1 : 1;
      });

      return updatedNotes;
    });
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            <Link
              to="/dashboard"
              className={`${styles.link} ${isActive("/dashboard")}`}>
              Dashboard
            </Link>
            <Link
              to="/trash"
              className={`${styles.link} ${isActive("/trash")}`}>
              Trash
            </Link>
            <Link to="/" className={`${styles.link} ${styles.logout}`}>
              Logout
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className={styles.mainContent}>
          <Outlet
            context={{
              notes,
              setNotes,
              isLoading: isNotesDataLoading,
              onPinToggle: handlePinToggle,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
