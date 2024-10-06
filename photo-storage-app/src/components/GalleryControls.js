import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

export const GalleryControls = ({
  sortOrder,
  setSortOrder,
  showFavoritesOnly,
  setShowFavoritesOnly,
  filterCategories,
  setFilterCategories,
  categories = [],
  onAddCategory,
  onRemoveCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const categoryOptions = [
    { label: "People", value: "people" },
    { label: "Nature", value: "nature" },
    { label: "Sky", value: "sky" },
    { label: "Other", value: "other" },
    ...categories.map((cat) => ({ label: cat, value: cat })),
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort by:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="custom">Custom Order</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="filterCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Categories:
          </label>
          <MultiSelect
            options={categoryOptions}
            value={filterCategories}
            onChange={setFilterCategories}
            labelledBy="Select categories"
            className="w-full"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showFavorites"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label
            htmlFor="showFavorites"
            className="ml-2 block text-sm text-gray-900"
          >
            Show Favorites Only
          </label>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Category
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onRemoveCategory(e.target.value);
              e.target.value = "";
            }
          }}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Remove a category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
