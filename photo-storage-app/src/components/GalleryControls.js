import React, { useState } from "react";

export const GalleryControls = ({
  sortOrder,
  setSortOrder,
  showFavoritesOnly,
  setShowFavoritesOnly,
  filterCategory,
  setFilterCategory,
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

  return (
    <div className="mb-4 flex flex-wrap justify-between items-center">
      {/* <h2 className="text-2xl font-semibold mb-2 w-full">Photo Gallery</h2> */}
      <div className="flex flex-wrap items-center space-x-4">
        <div className="ml-5">
          <label htmlFor="sortOrder" className="mr-2">
            Sort by:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="form-select"
          >
            <option value="custom">Custom Order</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterCategory" className="mr-2">
            Filter:
          </label>
          <select
            id="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-select"
          >
            <option value="all">All</option>
            <option value="people">People</option>
            <option value="nature">Nature</option>
            <option value="sky">Sky</option>
            <option value="other">Other</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="showFavorites" className="mr-2">
            Show Favorites Only
          </label>
          <input
            type="checkbox"
            id="showFavorites"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="form-input mr-2"
          />
          <button
            onClick={handleAddCategory}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Category
          </button>
        </div>
        <div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onRemoveCategory(e.target.value);
                e.target.value = "";
              }
            }}
            className="form-select mr-2"
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
    </div>
  );
};
