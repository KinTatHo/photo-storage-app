import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [details, setDetails] = useState(photo.details || "");
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    setSelectedCategories(
      photo.categories
        ? photo.categories.map((cat) => ({ label: cat, value: cat }))
        : []
    );
    setDetails(photo.details || "");
  }, [photo]);

  useEffect(() => {
    setCategoryOptions([
      { label: "People", value: "People" },
      { label: "Nature", value: "Nature" },
      { label: "Sky", value: "Sky" },
      { label: "Other", value: "Other" },
      ...categories.map((cat) => ({ label: cat, value: cat })),
    ]);
  }, [categories]);

  const handleSave = () => {
    const updatedCategories = selectedCategories.map((cat) => cat.value);
    onUpdateDetails(photo.id, {
      categories: updatedCategories,
      details,
    });
    setEditMode(false);
    photo.categories = updatedCategories;
    photo.details = details;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{photo.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-auto p-4 space-y-4">
          <img
            src={photo.url}
            alt={photo.name}
            className="max-w-full max-h-[50vh] object-contain mx-auto"
          />

          {!editMode && (
            <div>
              <p className="font-semibold text-gray-700">
                {photo.categories && photo.categories.length === 1
                  ? "Category:"
                  : "Categories:"}
              </p>
              <p className="text-blue-600">
                {photo.categories
                  ? photo.categories
                      .map(
                        (category) =>
                          category.charAt(0).toUpperCase() + category.slice(1)
                      )
                      .join(", ")
                  : "No categories assigned"}
              </p>
              {photo.details && (
                <>
                  <p className="font-semibold text-gray-700 mt-2">Details:</p>
                  <p className="text-gray-600">{photo.details}</p>
                </>
              )}
            </div>
          )}

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <MultiSelect
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  labelledBy="Select categories"
                />
              </div>
              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter details"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Edit Details
            </button>
          )}

          {isAnalyzing ? (
            <p className="text-center text-blue-500">Analyzing image...</p>
          ) : analysisResult ? (
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
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
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Analyze Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
