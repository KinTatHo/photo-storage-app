import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="overflow-hidden rounded-lg shadow-lg">
          <img src={photo.url} alt={photo.name} className="w-full h-48 object-cover" />
          <div className="px-4 py-2 bg-white">
            <p className="text-sm text-gray-700 truncate">{photo.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;