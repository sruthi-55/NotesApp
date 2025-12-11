import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { togglePinNote, deleteNoteById } from "../services/NoteService";
import styles from "./NoteCard.module.css";

const NoteCard = ({ note, onPinToggle, onDelete }) => {
  const navigate = useNavigate();
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isNoteDeleting, setIsNoteDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const handleDelete = () => {
  //   if (window.confirm("Are you sure you want to delete this note?")) {
  //     deleteNoteById(note.id)
  //       .then(() => {
  //         alert("Note deleted");
  //         if (onDelete) onDelete(note.id);
  //       })
  //       .catch((err) => alert("Failed to delete note: " + err.message));
  //   }
  // };

  const handleDelete = () => {
    // setIsNoteDeleting(true);
    setErrorMessage("");
    setIsDeleteModalOpen(true);
  };

  const handlePinClick = async () => {
    setIsPinLoading(true);
    try {
      await togglePinNote(note.id);
      if (onPinToggle) onPinToggle(note.id); // update parent state
    } catch (err) {
      alert("Failed to toggle pin status");
      console.error(err);
    } finally {
      setIsPinLoading(false);
    }
  };

  const createSnippet = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  return (
    <>
      <div className={styles.card} onClick={() => navigate(`/view/${note.id}`)}>
        <h2 className={styles.title}>{note.title}</h2>
        <p className={styles.snippet}>{createSnippet(note.content)}</p>
        <p className={styles.updated}>
          Updated: {new Date(note.updatedAt).toLocaleString()}
        </p>

        <div className={styles.tags}>
          {Array.isArray(note.tags) && note.tags.length > 0 ? (
            note.tags.map((tag, index) => {
              if (!tag) return null;
              const tagName =
                typeof tag === "string" ? tag : tag.name || "Unknown";
              const tagKey =
                typeof tag === "string"
                  ? tag + index
                  : tag.id || tagName + index;

              return (
                <span key={tagKey} className={styles.tag}>
                  {tagName}
                </span>
              );
            })
          ) : (
            <span className={styles.tag}>No tags</span>
          )}
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.button}
            disabled={isPinLoading} // disabled while loading
            onClick={(e) => {
              e.stopPropagation();
              handlePinClick();
            }}>
            {note.pinned ? "Unpin" : "Pin"}
          </button>

          <button
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${note.id}`);
            }}>
            Edit
          </button>

          <button
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}>
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => e.stopPropagation()}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete this note?</p>
            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalButton} ${styles.delete}}`}
                onClick={async () => {
                  setIsDeleteModalOpen(false);
                  setIsNoteDeleting(true);
                  try {
                    await deleteNoteById(note.id);
                    if (onDelete) onDelete(note.id);
                    setIsNoteDeleting(false);
                  } catch (err) {
                    setErrorMessage("Failed to delete note: " + err.message);
                    setIsNoteDeleting(false);
                  }
                }}>
                Yes, Delete
              </button>
              <button
                className={`${styles.modalButton} ${styles.cancel}}`}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setIsNoteDeleting(false);
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading / error modal */}
      {(isNoteDeleting || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isNoteDeleting ? (
              <>
                <div className={styles.loader}></div>
                <p>Deleting note...</p>
              </>
            ) : (
              <>
                <p style={{ color: "red", marginBottom: "1rem" }}>
                  {errorMessage}
                </p>
                <button
                  className={styles.restoreBtn}
                  onClick={() => setErrorMessage("")}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
