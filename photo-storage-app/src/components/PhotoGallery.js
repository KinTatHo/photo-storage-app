import React, { useState, useCallback } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDndSensors } from "./hooks/useSensors";
import { usePhotos } from "./hooks/usePhotos";
import { useCategories } from "./hooks/useCategories";
import { SortablePhoto } from "./SortablePhoto";
import { DragOverlayContent } from "./DragOverlayContent";
import { PhotoModal } from "./PhotoModal";
import { GalleryControls } from "./GalleryControls";
import { handleDragEnd } from "./utils/dragHandlers";
import {
  removePhoto,
  toggleFavorite,
  analyzePhoto,
  updatePhotoDetails,
  addCategory,
  removeCategory
} from "./utils/photoActions";

const PhotoGallery = ({ userId }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("custom");
  const [filterCategory, setFilterCategory] = useState("all");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sensors = useDndSensors();
  const {
    photos,
    isLoading: photosLoading,
    error: photosError,
    setPhotos,
    setError,
  } = usePhotos(userId, sortOrder);
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(userId);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = useCallback(
    (event) => handleDragEnd(event, photos, setPhotos),
    [photos]
  );

  const handleAnalyze = async (photo) => {
    await analyzePhoto(
      photo,
      setIsAnalyzing,
      setError,
      setAnalysisResult,
      setSelectedPhoto,
      setPhotos
    );
  };

  const handleUpdatePhotoDetails = async (photoId, updates) => {
    await updatePhotoDetails(userId, photoId, updates, setError, setPhotos);
  };

  const handleAddUserCategory = async (category) => {
    await addCategory(userId, category, setError);
  };

  const handleRemoveUserCategory = async (category) => {
    await removeCategory(userId, category, setError, setPhotos);
  };


  const filteredPhotos = photos.filter((photo) => {
    if (showFavoritesOnly && !photo.isFavorite) return false;
    if (filterCategory === "all") return true;
    return (
      photo.category === filterCategory || photo.userCategory === filterCategory
    );
  });

  if (photosLoading || categoriesLoading)
    return <div className="text-center mt-8 text-gray-500">Loading...</div>;
  if (photosError || categoriesError)
    return (
      <div className="text-center mt-8 text-red-500">
        Error: {photosError || categoriesError}
      </div>
    );

  return (
    <>
      <GalleryControls
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories || []}
        onAddCategory={handleAddUserCategory}
        onRemoveCategory={handleRemoveUserCategory}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={filteredPhotos.map((photo) => photo.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {filteredPhotos.map((photo) => (
              <SortablePhoto
                key={photo.id}
                photo={photo}
                onRemove={() =>
                  removePhoto(userId, photo.id, photos, setError, setPhotos)
                }
                onView={setSelectedPhoto}
                onToggleFavorite={() =>
                  toggleFavorite(userId, photo.id, photos, setError, setPhotos)
                }
                onAnalyze={() => handleAnalyze(photo)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragOverlayContent
              photo={filteredPhotos.find((p) => p.id === activeId)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => {
            setSelectedPhoto(null);
            setAnalysisResult(null);
          }}
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
          onAnalyze={() => handleAnalyze(selectedPhoto)}
          onUpdateDetails={handleUpdatePhotoDetails}
          categories={categories || []}
        />
      )}
    </>
  );
};

export default PhotoGallery;
