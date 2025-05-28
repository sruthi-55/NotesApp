import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { togglePinNote } from "../services/NoteService";

const NoteCard = ({ note, onPinToggle }) => {
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(note.pinned);

  const createSnippet = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  const handlePinClick = () => {
    togglePinNote(note.id)
      .then(() => {
        setIsPinned(!isPinned);
        if (onPinToggle) onPinToggle(note.id);
      })
      .catch((err) => {
        alert("Failed to toggle pin status");
        console.error(err);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-md hover:shadow-lg transition cursor-pointer">
      <h2 className="text-xl font-bold">{note.title}</h2>
      <p className="mt-2 text-gray-700">{createSnippet(note.content)}</p>
      <p className="text-sm text-gray-400 mt-2">
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </p>

      <div className="mt-4 flex justify-between">
        <button
          className={`px-2 py-1 rounded ${
            isPinned ? "bg-yellow-400" : "bg-gray-300"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handlePinClick();
          }}
        >
          {isPinned ? "Unpin" : "Pin"}
        </button>

        <div>
          <button
            className="text-blue-600 mr-4 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${note.id}`);
            }}
          >
            Edit
          </button>

          <button
            className="text-red-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              alert("Delete feature coming soon");
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
