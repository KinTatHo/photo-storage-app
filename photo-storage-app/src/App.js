import React, { useState } from 'react';
import { useAuth } from './components/hooks/useAuth';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';
import { usePhotoGallery } from './components/hooks/usePhotoGallery';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Header from './components/Header';

function App() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { photos, setPhotos, isLoading: photosLoading, error } = usePhotoGallery(user?.uid);
  const [authMode, setAuthMode] = useState('signin');

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Header user={user} onSignOut={signOut} />
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {authMode === 'signin' ? (
              <SignIn onToggleMode={() => setAuthMode('signup')} />
            ) : (
              <SignUp onToggleMode={() => setAuthMode('signin')} />
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mb-8 md:mb-0">
              <PhotoUpload userId={user.uid} onUploadSuccess={() => console.log('Upload success')} />
            </div>
            <div className="md:w-3/4">
              {photosLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center mt-8 text-red-500 bg-red-100 p-4 rounded">Error: {error}</div>
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