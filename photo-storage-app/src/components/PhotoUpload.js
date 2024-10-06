import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  where,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { useAuth } from "./hooks/useAuth";

const PhotoUpload = ({ onUploadSuccess, userId }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one image to upload.");
      return;
    }

    if (!user) {
      setError("You must be logged in to upload photos.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const q = query(
        collection(db, "photos"),
        where("userId", "==", user.uid),
        orderBy("order", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const highestOrder = querySnapshot.empty
        ? 0
        : querySnapshot.docs[0].data().order;

      const uploadPromises = files.map(async (file, index) => {
        const storageRef = ref(storage, `photos/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "photos"), {
          userId: user.uid,
          name: file.name,
          url: downloadURL,
          timestamp: serverTimestamp(),
          order: highestOrder + index + 1,
          isFavorite: false,
        });
      });

      await Promise.all(uploadPromises);

      setFiles([]);
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading photos:", error);
      setError(`Error uploading photos: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          className={`cursor-pointer border-2 border-dashed rounded-lg p-4 mb-4 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-center text-gray-500">
            {isDragActive
              ? "Drop the files here..."
              : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </div>
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
