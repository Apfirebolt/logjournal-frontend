"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/plugins/interceptor";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TemplateForm from "@/components/TemplateForm";
import { useDispatch, useSelector } from "react-redux";
import {
  createTemplate,
  getTemplates,
} from "../../features/templates/templateSlice";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const templateList = useSelector((state) => state.template.templateList);
  const isLoading = useSelector((state) => state.template.isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Template List:", templateList?.results || []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // call API only if token is available
  useEffect(() => {
    if (session?.user?.token) {
      const params = {
        token: session.user.token,
        page: 1,
        search: "",
      };
      dispatch(getTemplates(params));
    }
  }, [session, dispatch]);

  const createTemplateHandler = async (templateData) => {
    console.log("Creating template with data:", templateData);
    try {
      const payload = {
        token: session.user.token,
        templateData: templateData,
      };
      await dispatch(createTemplate(payload));
      setIsModalOpen(false);
      await dispatch(
        getTemplates({
          token: session.user.token,
          page: currentPage,
          search: searchText,
        })
      );
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Log Journal - Dashboard</title>
        <meta
          name="description"
          content="Welcome to your personal dashboard on Log Journal. Manage your activities, track your progress, and stay organized with all your important information in one place."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="log journal, dashboard, productivity, tasks, progress"
        />
        <meta name="author" content="Animix" />
        <meta property="og:title" content="Log Journal - Dashboard" />
        <meta
          property="og:description"
          content="Welcome to your personal dashboard on Log Journal. Manage your activities, track your progress, and stay organized with all your important information in one place."
        />
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
              <h1 className="text-5xl font-bold mb-4">Dashboard</h1>
              <p className="text-lg mb-4">
                Welcome to your personal dashboard! Here you can manage your
                activities, track your progress, and stay organized with all
                your important information in one place.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Create New Template
              </button>
            </div>
          </div>
        </section>

        <section className="container mx-auto p-6 bg-white rounded-lg shadow-lg my-6">
          <h2 className="text-2xl font-bold mb-4">Your Templates</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading templates...</p>
            </div>
          ) : templateList?.results && templateList.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templateList.results.map((template) => (
                <div
                  key={template.uuid}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{template.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No templates found. Create your first template above!
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Create New Template</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <TemplateForm createTemplate={createTemplateHandler} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default Dashboard;
