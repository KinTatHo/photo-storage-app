import React, { useState } from 'react';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';

function App() {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Photo Storage</h1>
      <PhotoUpload onUploadSuccess={handleUploadSuccess} />
      <PhotoGallery key={refreshGallery} />
    </div>
  );
}

export default App;