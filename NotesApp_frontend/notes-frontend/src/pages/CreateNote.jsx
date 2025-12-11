import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./CreateNote.module.css";
import { useOutletContext } from "react-router-dom";

const CreateNote = () => {
  const { setNotes } = useOutletContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setErrorMessage("");
    e.preventDefault();

    const token = localStorage.getItem("token");
    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      const response = await fetch("http://localhost:8080/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content: sanitizedContent,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes((prev) => [...prev, newNote]);
        setIsLoading(false);
        navigate("/dashboard");
      } else {
        setIsLoading(true);
        setErrorMessage("Failed to create note");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to create note");
    }
  };

  return (
    <>
      {/* Loading / error modal */}
      {(isLoading || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isLoading ? (
              <>
                <div className={styles.loader}></div>
                <p>Creating note...</p>
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

      <div className={styles.container}>
        <Link to="/dashboard" className={styles.backLink}>
          &larr; Back to Notes
        </Link>
        <h2 className={styles.heading}>Create New Note</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <ReactQuill
            value={content}
            onChange={setContent}
            className={styles.quill}
            theme="snow"
            placeholder="Write your note here..."
          />

          <input
            type="text"
            className={styles.tagInput}
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}>
              Create Note
            </button>
            <button
              type="reset"
              className={`${styles.button} ${styles.resetButton}`}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateNote;
