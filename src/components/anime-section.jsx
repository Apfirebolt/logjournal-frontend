"use client";

import React, { useEffect, useState } from "react";
import AnimeCard from "./anime-card";
import { motion } from "framer-motion";
import Loader from "./loader";
import axiosInstance from "@/plugins/interceptor";

const AnimeSection = ({ anime }) => {
  const [animeList, setAnimeList] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isClient, setIsClient] = useState(false);

  const fetchAnimeData = async (link) => {
    try {
      setLoading(true);  
      if (searchText) {
        // add ?filter[text]=searchText to the link
        link = `${link}?filter[text]=${searchText}`;
      }
      const response = await axiosInstance.get(link);
      setAnimeList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching anime data:", error);
      setLoading(false);
    }
  };

  const searchAnime = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/anime?filter[text]=${searchText}`);
      setAnimeList(response.data);
      setLoading(false);
    }
    catch (error) {
      console.error("Error fetching anime data:", error);
      setLoading(false);
    }
  }

  const goToNextPage = (page) => {
    setCurrentPage(currentPage + 1);
    fetchAnimeData(animeList.links.next);
  };

  const goToPreviousPage = (page) => {
    setCurrentPage(currentPage - 1);
    fetchAnimeData(animeList.links.prev);
  }

  useEffect(() => {
    setIsClient(true);
    if (anime) { 
      setAnimeList(anime);
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loading && <Loader />}
      {!loading && animeList?.data?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          >
           <div className="flex justify-center my-4">
            <input
              type="text"
              placeholder="Search characters..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border text-white text-lg border-gray-300 rounded py-2 px-4 w-full max-w-lg"
            />
            <button
              className="bg-primary hover:bg-accent hover:text-black text-white font-bold py-2 px-4 rounded ml-2"
              onClick={() => searchAnime()}
            >
              Search
            </button>
          </div>  
          <div className="flex justify-center my-4">
            <button
              className="bg-background hover:bg-blue-700 text-secondary font-bold py-2 px-4 rounded"
              disabled={currentPage === 1}
              onClick={() => goToPreviousPage()}
            >
              Prev
            </button>
            <button
              className="bg-background hover:bg-blue-700 text-secondary font-bold py-2 px-4 rounded ml-2"
              onClick={() => goToNextPage()}
            >
              Next
            </button>
          </div>    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {animeList.data.map((animeItem) => (
              <AnimeCard key={animeItem.id} anime={animeItem} />
            ))}
          </div>
        </motion.div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AnimeSection;
