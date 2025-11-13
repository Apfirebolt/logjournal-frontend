import React, { Fragment } from "react";
import axiosInstance from "@/plugins/interceptor";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AnimeSection from "@/components/anime-section";

async function getAnimeList() {
  try {
    const response = await axiosInstance.get("anime"); // Replace with your API endpoint
    
    const anime = response.data;
    return anime;
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return [];
  }
}

const AnimePage = async () => {
  const anime = await getAnimeList();

  return (
    <Fragment>
      <Head>
        <title>Anime List - Animix</title>
        <meta name="description" content="Discover your favorite anime series on Animix. Browse through a diverse collection of anime from various genres." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="anime, Animix, anime list, anime series, watch anime" />
        <meta name="author" content="Animix" />
        <meta property="og:title" content="Anime List - Animix" />
        <meta property="og:description" content="Discover your favorite anime series on Animix. Browse through a diverse collection of anime from various genres." />
        <meta property="og:image" content="https://example.com/anime-thumbnail.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/anime" />
      </Head>
      <Header />
      <main className="bg-gradient-to-r from-purple-700 to-indigo-900">
        <section className="container mx-auto p-6">
          <div className="relative bg-gray-800 text-white rounded-lg overflow-hidden">
            <img
              src="https://4kwallpapers.com/images/walls/thumbs_3t/13988.jpg"
              alt="Anime Hero Background"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative z-10 p-8">
              <h1 className="text-5xl font-bold mb-4">Anime List</h1>
              <p className="text-lg mb-4">
                Dive into the world of anime and explore a variety of series available on Animix.
              </p>
            </div>
          </div>
          <AnimeSection anime={anime} />
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default AnimePage;
