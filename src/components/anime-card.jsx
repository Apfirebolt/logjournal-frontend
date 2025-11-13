"use client";

import React from "react";

const AnimeCard = ({ anime }) => {
  return (
    <div className="category-card bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <img
        src={anime.attributes.posterImage?.medium}
        alt={anime.attributes.canonicalTitle}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-bold mb-2">
        {anime.attributes.canonicalTitle}
      </h2>
      <p className="text-sm text-gray-600 mb-2">
        {anime.attributes.synopsis?.substring(0, 100)}...
      </p>
      <div className="text-sm text-gray-800">
        <p>
          <strong>Rating:</strong> {anime.attributes.averageRating}
        </p>
        <p>
          <strong>Age Rating:</strong> {anime.attributes.ageRating} (
          {anime.attributes.ageRatingGuide})
        </p>
        <p>
          <strong>Episodes:</strong> {anime.attributes.episodeCount}
        </p>
        <p>
          <strong>Status:</strong> {anime.attributes.status}
        </p>
      </div>
    </div>
  );
};

export default AnimeCard;
