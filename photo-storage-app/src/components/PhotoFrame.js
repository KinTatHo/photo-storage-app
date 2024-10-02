import React from "react";
import { Draggable } from "react-beautiful-dnd";

const PhotoFrame = ({ photo, index, onRemove }) => {
  return (
    <Draggable draggableId={photo.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow-md w-64"
        >
          <img
            src={photo.url}
            alt={photo.name}
            className="w-full h-48 object-cover rounded-md mb-2"
          />
          <p className="text-sm text-gray-700 truncate">{photo.name}</p>
          <button
            onClick={() => onRemove(photo.id)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default PhotoFrame;
