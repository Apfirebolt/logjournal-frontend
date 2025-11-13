"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeOnClickOutside = (e) => {
    if (isOpen && !e.target.closest(".fixed")) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Games", path: "/games" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  useEffect(() => {
    document.addEventListener("click", closeOnClickOutside);
    return () => {
      document.removeEventListener("click", closeOnClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold p-6 flex items-center">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Log Journal
          </Link>
          <FaBars
            className="text-2xl ml-auto cursor-pointer sm:hidden hover:text-blue-400 transition-colors"
            onClick={toggleMenu}
          />
        </h1>
        <nav className="p-6 hidden sm:block">
          <ul className="flex space-x-6">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="px-4 py-2 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-lg font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full bg-slate-900 text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:hidden shadow-2xl`}
      >
        <div className="p-6 flex justify-between items-center border-b border-slate-700">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Log Journal
            </Link>
          </h1>
          <FaTimes className="text-2xl cursor-pointer hover:text-red-400 transition-colors" onClick={toggleMenu} />
        </div>
        <ul className="space-y-2 p-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="block px-4 py-3 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
