import React from "react";
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  // create a plain text snippet from rich content
  const createSnippet = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
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
            note.pinned ? "bg-yellow-400" : "bg-gray-300"
          }`}
          onClick={() => alert("Pin/Unpin feature coming soon")}
        >
          {note.pinned ? "Unpin" : "Pin"}
        </button>

        <div>
          <button
            className="text-blue-600 mr-4 hover:underline"
            onClick={() => navigate(`/edit/${note.id}`)}
          >
            Edit
          </button>

          <button
            className="text-red-600 hover:underline"
            onClick={() => alert("Delete feature coming soon")}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
