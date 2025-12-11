import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getNoteById, updateNote } from "../services/NoteService";
import styles from "./EditNote.module.css";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // fetch notes
  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const res = await getNoteById(id);
        const note = res.data;

        setTitle(note.title);
        setContent(note.content);

        if (note.tags && Array.isArray(note.tags)) {
          const safeTags = note.tags
            .filter(
              (t) => t && (typeof t === "object" || typeof t === "string")
            )
            .map((t) => (typeof t === "string" ? t : t.name || "Unnamed Tag"));
          setTags(safeTags);
        } else if (note.tagNames && Array.isArray(note.tagNames)) {
          setTags(note.tagNames);
        } else {
          setTags([]);
        }
      } catch (err) {
        console.error("Failed to fetch note:", err);
        setErrorMessage(err.response?.data?.message || "Failed to fetch note");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleUpdateNote = async () => {
    const data = { title, content, tags };
    setIsUpdating(true);
    setErrorMessage("");

    try {
      await updateNote(id, data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update note:", err);
      setErrorMessage(err.response?.data?.message || "Failed to update note");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Loading / updating / error modal */}
      {(isLoading || isUpdating || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isLoading ? (
              <>
                <div className={styles.loader}></div>
                <p>Loading note...</p>
              </>
            ) : isUpdating ? (
              <>
                <div className={styles.loader}></div>
                <p>Updating note...</p>
              </>
            ) : (
              <>
                <p style={{ color: "red", marginBottom: "1rem" }}>
                  {errorMessage}
                </p>
                <button
                  className={styles.updateBtn}
                  onClick={() => setErrorMessage("")}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      {!isLoading && !errorMessage && (
        <div className={styles.container}>
          <Link to="/dashboard" className={styles.backLink}>
            &larr; Back
          </Link>

          <h1 className={styles.heading}>Edit Note</h1>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />

          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className={styles.quillEditor}
          />

          <div className={styles.tagsContainer}>
            <div className={styles.tagList}>
              <h3 className={styles.tagLabel}>Tags: </h3>

              {tags.map((tag, index) => (
                <div key={`${tag}-${index}`} className={styles.tag}>
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.removeBtn}>
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.tagInputRow}>
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className={styles.tagInput}
              />

              <button onClick={handleAddTag} className={styles.addTagBtn}>
                Add
              </button>
            </div>
          </div>

          <button onClick={handleUpdateNote} className={styles.updateBtn}>
            Update Note
          </button>
        </div>
      )}
    </>
  );
};

export default EditNote;
