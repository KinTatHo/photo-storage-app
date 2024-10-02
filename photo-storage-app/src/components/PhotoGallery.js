import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";

const SortablePhoto = ({ photo, onRemove, onView }) => {
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
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-move hover:shadow-lg transition-all duration-300 group"
    >
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={photo.url}
          alt={photo.name}
          className="w-full h-full object-cover"
        />
      </div>
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
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-75 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-sm text-gray-700 truncate">{photo.name}</p>
      </div>
    </div>
  );
};

const DragOverlayContent = ({ photo }) => (
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

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("order"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newPhotos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(newPhotos);
        setIsLoading(false);
        console.log("Photos loaded:", newPhotos.length);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      if (active.id !== over.id) {
        setPhotos((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });

        try {
          const batch = writeBatch(db);
          photos.forEach((photo, index) => {
            const docRef = doc(db, "photos", photo.id);
            batch.update(docRef, { order: index });
          });
          await batch.commit();
        } catch (error) {
          console.error("Error updating photo order:", error);
        }
      }

      setActiveId(null);
    },
    [photos]
  );

  const removePhoto = async (id) => {
    try {
      const photoToRemove = photos.find((photo) => photo.id === id);
      if (!photoToRemove) return;

      const storageRef = ref(storage, `photos/${photoToRemove.name}`);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, "photos", id));
    } catch (err) {
      console.error("Error removing photo:", err);
      setError(err.message);
    }
  };

  const viewPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  if (isLoading)
    return <div className="text-center mt-8 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={photos.map((photo) => photo.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {photos.map((photo) => (
              <SortablePhoto
                key={photo.id}
                photo={photo}
                onRemove={removePhoto}
                onView={viewPhoto}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragOverlayContent photo={photos.find((p) => p.id === activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-3xl max-h-[90vh] overflow-auto bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <p className="mt-2 text-center text-gray-700">
              {selectedPhoto.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
