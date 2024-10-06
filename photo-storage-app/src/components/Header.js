import React from "react";

const Header = ({ user, onSignOut }) => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Photo Gallery</h1>
        {user && (
          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
