import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getNoteById, updateNote } from "../services/NoteService";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States for note fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  // Load note data on mount
  useEffect(() => {
    getNoteById(id)
      .then((res) => {
        const note = res.data;
        setTitle(note.title);
        setContent(note.content);

        if (note.tags && Array.isArray(note.tags)) {
          // Filter null or undefined tags, then map name safely
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
      })
      .catch((err) => {
        console.error("Failed to fetch note:", err);
      });
  }, [id]);

  // Add tag handler
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Update note handler
  const handleUpdateNote = () => {
    const data = {
      title,
      content,
      tags,
    };

    updateNote(id, data)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Failed to update note:", err);
      });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <div
              key={`${tag}-${index}`}
              className="bg-gray-200 rounded-full px-3 py-1 flex items-center space-x-2">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500 font-bold">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddTag}
            className="bg-blue-500 text-white px-4 rounded">
            Add
          </button>
        </div>
      </div>
      <button
        onClick={handleUpdateNote}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded">
        Update Note
      </button>
    </div>
  );
};

export default EditNote;
