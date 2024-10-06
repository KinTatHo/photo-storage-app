import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

export const useUserCategories = (userId) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setError("User ID is undefined");
      return;
    }

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          setCategories(doc.data().categories || []);
        } else {
          setCategories([]);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching user categories:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { categories, isLoading, error };
};
