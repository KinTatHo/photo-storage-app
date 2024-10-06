import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc, collection, query, where, getDocs, addDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { analyzeImage } from "../api/visionApi";

export const removePhoto = async (
  userId,
  photoId,
  photos,
  setError,
  setPhotos
) => {
  try {
    const photoToRemove = photos.find((photo) => photo.id === photoId);
    if (!photoToRemove) return;

    const storageRef = ref(storage, `photos/${userId}/${photoToRemove.name}`);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, "photos", photoId));
    setPhotos(photos.filter((photo) => photo.id !== photoId));
  } catch (err) {
    console.error("Error removing photo:", err);
    setError(err.message);
  }
};

export const toggleFavorite = async (
  userId,
  photoId,
  photos,
  setError,
  setPhotos
) => {
  try {
    const photoRef = doc(db, "photos", photoId);
    const photoToUpdate = photos.find((photo) => photo.id === photoId);
    if (!photoToUpdate) return;

    const updatedPhoto = {
      ...photoToUpdate,
      isFavorite: !photoToUpdate.isFavorite,
    };
    await updateDoc(photoRef, { isFavorite: updatedPhoto.isFavorite });
    setPhotos(
      photos.map((photo) => (photo.id === photoId ? updatedPhoto : photo))
    );
  } catch (err) {
    console.error("Error toggling favorite:", err);
    setError(err.message);
  }
};

export const analyzePhoto = async (
  photo,
  setIsAnalyzing,
  setError,
  setAnalysisResult,
  setSelectedPhoto,
  setPhotos
) => {
  setIsAnalyzing(true);
  setError(null);
  try {
    console.log("Starting analysis for photo:", photo.name, "URL:", photo.url);

    const result = await analyzeImage(photo.url);
    console.log("Analysis result:", result);

    let category = "other";
    if (result.faces > 0) {
      category = "people";
    } else if (
      result.labels.some((label) =>
        ["nature", "landscape", "outdoor", "plant", "tree"].includes(
          label.toLowerCase()
        )
      ) &&
      !result.labels.includes("sky")
    ) {
      category = "nature";
    } else if (result.labels.includes("sky")) {
      category = "sky";
    }

    const updatedPhoto = { ...photo, category, analysisResult: result };
    await updateDoc(doc(db, "photos", photo.id), {
      category,
      analysisResult: result,
    });
    setPhotos((photos) =>
      photos.map((p) => (p.id === photo.id ? updatedPhoto : p))
    );

    setAnalysisResult(result);
    setSelectedPhoto({ ...photo, analysisResult: result });

  } catch (err) {
    console.error("Error in analyzePhoto:", err);
    setError(`Failed to analyze image: ${err.message}`);
    setAnalysisResult(null);
  } finally {
    setIsAnalyzing(false);
  }
};

export const updatePhotoDetails = async (
  userId,
  photoId,
  updates,
  setError,
  setPhotos
) => {
  try {
    const photoRef = doc(db, "photos", photoId);
    await updateDoc(photoRef, updates);
    setPhotos((photos) =>
      photos.map((p) => (p.id === photoId ? { ...p, ...updates } : p))
    );
  } catch (err) {
    console.error("Error updating photo details:", err);
    setError(err.message);
  }
};

export const addCategory = async (userId, category, setError) => {
    try {
      await addDoc(collection(db, "categories"), { userId, name: category });
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.message);
    }
  };
  
  export const removeCategory = async (userId, categoryName, setError, setPhotos) => {
    const batch = writeBatch(db);
  
    try {
      // Find and delete the category document
      const categoriesRef = collection(db, "categories");
      const categoryQuery = query(categoriesRef, where("userId", "==", userId), where("name", "==", categoryName));
      const categorySnapshot = await getDocs(categoryQuery);
      
      if (categorySnapshot.empty) {
        throw new Error("Category not found");
      }
  
      const categoryDoc = categorySnapshot.docs[0];
      batch.delete(doc(db, "categories", categoryDoc.id));
  
      // Find all photos with this category and update them
      const photosRef = collection(db, "photos");
      const photosQuery = query(photosRef, where("userId", "==", userId), where("category", "==", categoryName));
      const photosSnapshot = await getDocs(photosQuery);
  
      photosSnapshot.forEach((photoDoc) => {
        const photoRef = doc(db, "photos", photoDoc.id);
        batch.update(photoRef, { category: "other" });
      });
  
      // Commit the batch
      await batch.commit();
  
      // Update local state
      setPhotos((prevPhotos) => 
        prevPhotos.map((photo) => 
          photo.category === categoryName ? { ...photo, category: "other" } : photo
        )
      );
  
    } catch (err) {
      console.error("Error removing category:", err);
      setError(err.message);
    }
  };