import React, { Fragment } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "About Us Page",
  description: "Learn more about Animix.",
};

const AboutPage = () => {
  return (
    <Fragment>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <section className="max-w-4xl mx-auto text-center p-12 bg-white shadow-xl rounded-lg border-2 border-amber-200">
          <h1 className="text-5xl font-serif font-bold mb-6 text-amber-900">Welcome to LogJournal</h1>
          <p className="text-xl text-gray-700 leading-relaxed font-serif">
            Your personal space to capture thoughts, memories, and reflections. 
            Experience journaling with elegance and simplicity.
          </p>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default AboutPage;
