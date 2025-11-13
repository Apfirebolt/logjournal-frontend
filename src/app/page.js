"use client";

import Image from "next/image";
import React, { Fragment } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <Fragment>
      <Header />
      <main className="min-h-screen flex flex-col">
        <section
          className="relative w-full h-screen bg-cover bg-center flex items-center justify-center text-white"
          style={{
            backgroundImage:
              "url('https://4kwallpapers.com/images/walls/thumbs_3t/13988.jpg')",
          }}
        >
          <motion.div
            className="bg-black bg-opacity-50 p-6 rounded-lg text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold mb-4">Welcome to Animix</h1>
            <p className="text-lg mb-4">
              Welcome to Animix! Your ultimate destination for everything
              related to anime.
            </p>
            <p className="text-lg mb-4">
              Dive into a vast collection of anime series, explore detailed
              character profiles, and stay updated with the latest news in the
              anime world.
            </p>
            <p className="text-lg mb-4">
              Whether you're a long-time fan or just starting your anime
              journey, Animix is here to provide you with all the information
              and resources you need.
            </p>
            <p className="text-lg">
              Thank you for visiting Animix. We hope you enjoy exploring the
              fascinating world of anime with us!
            </p>
            <button className="px-6 my-3 py-3 bg-accent text-secondary hover:bg-blue-600 font-semibold rounded">
              Explore Now
            </button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default Home;
