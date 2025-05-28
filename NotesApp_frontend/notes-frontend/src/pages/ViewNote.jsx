import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNoteById } from "../services/NoteService";

const ViewNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    getNoteById(id)
      .then((res) => setNote(res.data))
      .catch((err) => console.error("Failed to load note", err));
  }, [id]);

  if (!note) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
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
            .filter((tag) => tag)   // remove null or undefined
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
