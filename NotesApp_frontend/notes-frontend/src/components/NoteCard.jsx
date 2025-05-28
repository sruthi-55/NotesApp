import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { togglePinNote } from "../services/NoteService";

const NoteCard = ({ note, onPinToggle }) => {
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(note.pinned);

  useEffect(() => {
    setIsPinned(note.pinned);
  }, [note.pinned]);

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

  const createSnippet = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };


 
  console.log("NoteCard tags:", note.tags);

  return (
    <div
      className="bg-white rounded-lg shadow p-4 w-full max-w-md hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/edit/${note.id}`)}>
      <h2 className="text-xl font-bold">{note.title}</h2>
      <p className="mt-2 text-gray-700">{createSnippet(note.content)}</p>
      <p className="text-sm text-gray-400 mt-2">
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </p>

      {/* Tags */}
      {Array.isArray(note.tags) && note.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {note.tags.map((tag, index) => {
            if (!tag) return null;

            const tagName =
              typeof tag === "string" ? tag : tag.name || "Unknown";
            const tagKey =
              typeof tag === "string" ? tag + index : tag.id || tagName + index;

            return (
              <span
                key={tagKey}
                className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {tagName+", "}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="mt-2 text-gray-400 text-sm italic">No tags</div>
      )}

      <div className="mt-4 flex justify-between items-center">
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

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${note.id}`);
            }}
            className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white">
            Edit
          </button>

          <button
            className="text-red-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              alert("Delete feature coming soon");
            }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
