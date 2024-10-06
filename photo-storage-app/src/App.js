import React from 'react';
import { useAuth } from './components/hooks/useAuth';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';
import { usePhotoGallery } from './components/hooks/usePhotoGallery';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {
  const { user, isLoading: authLoading } = useAuth();
  const { photos, setPhotos, isLoading: photosLoading, error } = usePhotoGallery(user?.uid);

  if (authLoading) {
    return <div className="text-center mt-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Photo Gallery</h1>
        {!user ? (
          <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-1/2 max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
              <SignIn />
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
              <SignUp />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mb-8 md:mb-0">
              <PhotoUpload userId={user.uid} onUploadSuccess={() => console.log('Upload success')} />
            </div>
            <div className="md:w-3/4">
              {photosLoading ? (
                <div className="text-center mt-8 text-gray-500">Loading photos...</div>
              ) : error ? (
                <div className="text-center mt-8 text-red-500">Error: {error}</div>
              ) : (
                <PhotoGallery photos={photos} setPhotos={setPhotos} userId={user.uid} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;