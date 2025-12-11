import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getNoteById,
  deleteNoteById,
  getNoteVersions,
  restoreNoteVersion,
  fetchNotes,
} from "../services/NoteService";
import styles from "./ViewNote.module.css";
import { useOutletContext } from "react-router-dom";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [versions, setVersions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { setNotes } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // fetch note
        const noteRes = await getNoteById(id);
        setNote(noteRes.data);
      } catch (err) {
        console.error("Note fetch failed:", err);
        setErrorMessage(err.response?.data?.message || "Failed to fetch note");
        setIsLoading(false);
        return; // don't fetch versions
      }

      try {
        // fetch versions
        const versionRes = await getNoteVersions(id);
        setVersions(versionRes.data);
      } catch (err) {
        console.error("Version fetch failed:", err);
        setErrorMessage(
          err.response?.data?.message || "Failed to fetch note versions"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleRestoreVersion = (versionId) => {
    if (window.confirm("Restore to this version?")) {
      restoreNoteVersion(id, versionId)
        .then(() => {
          alert("Version restored");
          window.location.reload();
        })
        .catch((err) => alert("Failed to restore version: " + err.message));
    }
  };

  return (
    <>
      {/* loading / deleting / error modal */}
      {(isLoading || isDeleting || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isLoading || isDeleting ? (
              <>
                <div className={styles.loader}></div>
                <p>{isDeleting ? "Deleting note..." : "Loading note..."}</p>
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

      {/* Main content */}
      {note && !isLoading && !errorMessage && (
        <div className={styles.container}>
          <Link to="/dashboard" className={styles.backLink}>
            &larr; Back to Notes
          </Link>

          <div className={styles.header}>
            <h1 className={styles.title}>{note.title}</h1>
            <div className={styles.actions}>
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className={`${styles.editBtn} ${styles.button}`}>
                Edit
              </button>

              <button
                onClick={handleDelete}
                className={`${styles.deleteBtn} ${styles.button}`}>
                Delete
              </button>
            </div>
          </div>

          <p className={styles.timestamp}>
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </p>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {note.tags?.length > 0 && (
            <div className={styles.tags}>
              {note.tags
                .filter((tag) => tag)
                .map((tag, i) => {
                  const tagName =
                    typeof tag === "string"
                      ? tag
                      : typeof tag.name === "string"
                      ? tag.name
                      : "Tag";

                  return (
                    <span key={tagName + i} className={styles.tag}>
                      {tagName}
                    </span>
                  );
                })}
            </div>
          )}

          <div className={styles.versionSection}>
            <h2 className={styles.title}>Version History</h2>

            {versions.length === 0 ? (
              <p className={styles.timestamp}>No versions available</p>
            ) : (
              versions
                .filter(
                  (version) =>
                    new Date(version.versionedAt) < new Date(note.updatedAt)
                )
                .map((version, index) => (
                  <div key={index} className={styles.versionItem}>
                    <p className={styles.subtitle}>{version.title}</p>

                    <p className={styles.timestamp}>
                      Saved at: {new Date(version.versionedAt).toLocaleString()}
                    </p>

                    <div
                      className={styles.content}
                      dangerouslySetInnerHTML={{
                        __html: version.content,
                      }}
                    />

                    <button
                      onClick={() => handleRestoreVersion(version.id)}
                      className={styles.restoreBtn}>
                      Restore this Version
                    </button>
                  </div>
                ))
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div
              className={styles.modalOverlay}
              onClick={() => setIsDeleteModalOpen(false)} // click outside to close
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
              >
                <p>Are you sure you want to delete this note?</p>
                <div className={styles.modalButtons}>
                  <button
                    className={`${styles.modalButton} ${styles.delete}`}
                    onClick={async () => {
                      setIsDeleting(true);
                      setIsLoading(true);
                      try {
                        await deleteNoteById(id);
                        // fetch fresh notes from server
                        const res = await fetchNotes();
                        setNotes(res.data);
                        // setNotes((prev) => prev.filter((n) => n.id !== id));

                        setIsDeleteModalOpen(false);
                        navigate("/dashboard");
                      } catch (err) {
                        setErrorMessage(
                          "Failed to delete note: " + err.message
                        );
                      }
                      setIsDeleting(false);
                      setIsLoading(false);
                    }}>
                    Delete
                  </button>

                  <button
                    className={`${styles.modalButton} cancel`}
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setIsDeleting(false);
                    }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ViewNote;
