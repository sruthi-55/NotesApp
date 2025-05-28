import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getNoteById, deleteNoteById } from "../services/NoteService";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    getNoteById(id)
      .then((res) => setNote(res.data))
      .catch((err) => console.error("Failed to load note", err));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      console.log("Token for delete:", localStorage.getItem("token"));
      deleteNoteById(id)
        .then(() => {
          alert("Note deleted");
          navigate("/dashboard");
        })
        .catch((err) => alert("Failed to delete note: " + err.message));
    }
  };

  if (!note) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
      {/* Back to Notes Link */}
      <div className="mb-4">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Notes
        </Link>
      </div>

      {/* Title and buttons */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{note.title}</h1>

        <div>
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="mr-2 bg-yellow-300 hover:bg-yellow-400 px-4 py-1 rounded">
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">
            Delete
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      {note.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags
            .filter((tag) => tag) // remove null or undefined
            .map((tag, i) => {
              const tagName =
                typeof tag === "string"
                  ? tag
                  : typeof tag.name === "string"
                  ? tag.name
                  : "Tag";
              return (
                <span
                  key={tagName + i}
                  className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-sm">
                  {tagName}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ViewNote;
