"use client";

import React, { Fragment, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/plugins/interceptor";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TemplateForm from "@/components/TemplateForm";
import { useDispatch } from "react-redux";
import { createTemplate, getTemplates } from "../../features/templates/templateSlice";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

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
        search: ""
      };
      dispatch(getTemplates(params));
    }
  }, [session, dispatch]);
  
  const createTemplateHandler = async (templateData) => {
    console.log("Creating template with data:", templateData);
    try {
      const payload = {
        token: session.user.token,
        templateData: templateData
      }
      dispatch(createTemplate(payload));
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  }

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
            </div>
          </div>
        </section>
        <section className="container mx-auto p-6 bg-white rounded-lg shadow-lg my-6">
          <TemplateForm createTemplate={createTemplateHandler} />
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default Dashboard;
