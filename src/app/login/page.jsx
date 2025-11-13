"use client";

import React, { Fragment, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { MdEmail, MdLock } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginPage = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailTrim = email.trim();
    const passwordVal = password;

    if (!emailTrim || !passwordVal) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // keep manual redirect handling in this mock
        email: emailTrim,
        password: passwordVal,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Successful mock login
        setError("Login successful!");
      } else {
        setError("An unexpected response was received during authentication.");
      }
    } catch (err) {
      console.error("Network or API call failed:", err);
      setError("Network error: Could not reach NextAuth endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header />
      <main className="bg-gradient-to-r from-purple-700 to-indigo-900 min-h-screen flex items-center justify-center">
        <div className="container mx-auto p-6">
          <div className="max-w-md mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <FiLogIn className="text-purple-400" />
              Login
            </h1>

            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <FiLogIn />
                    Login
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <a href="/register" className="text-purple-400 hover:underline">
                Sign up
              </a>
            </p>

            {session?.user && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white">
                    Signed in as{" "}
                    <span className="font-medium">
                      {session.user.email || ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
};

export default LoginPage;
