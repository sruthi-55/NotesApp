import React from 'react';

const NoteCard = ({ note }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-md">
      <h2 className="text-xl font-bold">{note.title}</h2>
      <div
        className="mt-2 text-gray-700"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <p className="text-sm text-gray-400 mt-2">
        {new Date(note.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default NoteCard;
