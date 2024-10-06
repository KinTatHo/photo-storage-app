import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Heart } from "lucide-react";

export const SortablePhoto = ({
  photo,
  onRemove,
  onView,
  onToggleFavorite,
  onAnalyze,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-move hover:shadow-lg transition-all duration-300 group aspect-w-1 aspect-h-1"
    >
      <img
        src={photo.url}
        alt={photo.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(photo.id);
          }}
          className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
        >
          Remove
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(photo);
          }}
          className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
        >
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(photo.id);
          }}
          className="absolute bottom-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart
            size={20}
            className={`${
              photo.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-75 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-sm text-gray-700 truncate">{photo.name}</p>
      </div>
    </div>
  );
};