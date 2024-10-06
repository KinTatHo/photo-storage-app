import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "./useAuth";

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPhotos([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "photos"),
      where("userId", "==", user.uid),
      orderBy("order", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newPhotos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(newPhotos);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { photos, setPhotos, isLoading, error };
};