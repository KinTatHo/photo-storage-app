import React, { useState } from "react";

export const PhotoModal = ({
  photo,
  onClose,
  analysisResult,
  isAnalyzing,
  onAnalyze,
  onUpdateDetails,
  categories = [],
}) => {
  const [editMode, setEditMode] = useState(false);
  const [userCategory, setUserCategory] = useState(photo.userCategory || "");
  const [location, setLocation] = useState(photo.location || "");

  const handleSave = () => {
    onUpdateDetails(photo.id, { userCategory, location });
    setEditMode(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="max-w-3xl max-h-[90vh] overflow-auto bg-white p-4 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.name}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <p className="mt-2 text-center text-gray-700">{photo.name}</p>
        {photo.category && (
          <p className="mt-2 text-center text-blue-600">
            Category: {photo.category}
          </p>
        )}
        {editMode ? (
          <div className="mt-4">
            <select
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value)}
              className="block w-full mt-2 p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter details"
              className="block w-full mt-2 p-2 border rounded"
            />
            <button
              onClick={handleSave}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="mt-4">
            {photo.userCategory && <p>User Category: {photo.userCategory}</p>}
            {photo.location && <p>Location: {photo.location}</p>}
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Edit Details
            </button>
          </div>
        )}
        {isAnalyzing ? (
          <p className="mt-2 text-center text-blue-500">Analyzing image...</p>
        ) : analysisResult ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Analysis Results:</h3>
            <p>
              <strong>Labels:</strong> {analysisResult.labels.join(", ")}
            </p>
            {analysisResult.text && (
              <p>
                <strong>Detected Text:</strong> {analysisResult.text}
              </p>
            )}
            {analysisResult.faces > 0 && (
              <p>
                <strong>Faces Detected:</strong> {analysisResult.faces}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={onAnalyze}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Analyze Image
          </button>
        )}
      </div>
    </div>
  );
};
