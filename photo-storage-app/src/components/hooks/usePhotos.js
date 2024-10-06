import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export const usePhotos = (userId, sortOrder) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setError("User ID is required");
      return;
    }

    let q;
    if (sortOrder === "recent") {
      q = query(
        collection(db, "photos"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
    } else if (sortOrder === "custom") {
      q = query(
        collection(db, "photos"),
        where("userId", "==", userId),
        orderBy("order")
      );
    } else {
      q = query(collection(db, "photos"), where("userId", "==", userId));
    }

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
        console.error("Error fetching photos:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, sortOrder]);

  return { photos, setPhotos, isLoading, error, setError };
};
