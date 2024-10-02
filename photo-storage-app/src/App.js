import React from 'react';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';
import { usePhotoGallery } from './components/hooks/PhotoGalleryHook';

function App() {
  const { photos, setPhotos, isLoading, error } = usePhotoGallery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Photo Gallery</h1>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-8 md:mb-0">
            <PhotoUpload onUploadSuccess={() => console.log('Upload success')} />
          </div>
          <div className="md:w-3/4">
            {isLoading ? (
              <div className="text-center mt-8 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center mt-8 text-red-500">Error: {error}</div>
            ) : (
              <PhotoGallery photos={photos} setPhotos={setPhotos} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;