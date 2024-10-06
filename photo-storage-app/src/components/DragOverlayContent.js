import React from "react";

export const DragOverlayContent = ({ photo }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden opacity-90 pointer-events-none">
    <div className="aspect-w-1 aspect-h-1">
      <img
        src={photo.url}
        alt={photo.name}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  </div>
);