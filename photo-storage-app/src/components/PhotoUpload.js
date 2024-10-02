import React, { useState, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

const PhotoUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      setError(null);
      const newPreviews = droppedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    } else {
      setError("Please drop image files only.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one image to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `photos/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const q = query(collection(db, "photos"), orderBy("order", "desc"));
        const querySnapshot = await getDocs(q);
        const highestOrder = querySnapshot.empty
          ? 0
          : querySnapshot.docs[0].data().order;

        await addDoc(collection(db, "photos"), {
          name: file.name,
          url: downloadURL,
          timestamp: serverTimestamp(),
          order: highestOrder + 1,
        });
      });

      await Promise.all(uploadPromises);

      setFiles([]);
      setPreviews([]);
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading photos:", error);
      setError(`Error uploading photos: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {previews.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {previews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <span className="text-gray-500 text-sm text-center">
                Click to upload
                <br />
                or drag and drop
                <br />
                Choose multiple images
              </span>
            )}
          </label>
          <input
            id="photo-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Photos"}
        </button>
        {error && <p className="mt-2 text-red-500 text-xs">{error}</p>}
      </form>
    </div>
  );
};

export default PhotoUpload;
