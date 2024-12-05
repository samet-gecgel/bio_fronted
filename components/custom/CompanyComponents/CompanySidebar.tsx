"use client";

import { BriefcaseMedical, FileUser } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
export const CompanySidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { href: "/company", icon: FaTachometerAlt, text: "Genel" },
    { href: "/company/job-post", icon: FaBriefcase, text: "İş İlanlarım" },
    {
      href: "/company/job-post-add",
      icon: BriefcaseMedical,
      text: "İlan Oluştur",
    },
    { href: "/company/applicants", icon: FileUser, text: "Başvuranlar" },
    { href: "/company/settings", icon: FaCog, text: "Hesap Bilgilerim" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col bg-white h-screen overflow-y-hidden w-64 border-r border-gray-200">
        <div className="text-black font-semibold p-4">Şirket Paneli</div>
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <item.icon className="text-lg text-black" />
              <span className="text-black">{item.text}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-md text-red-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Çıkış yap</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
        <div className="text-black font-semibold space-x-2">Şirket Paneli</div>
        <button
          className="p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <IoClose className="h-6 w-6 text-gray-600" />
          ) : (
            <FaBars className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <div className="text-black font-semibold">Şirket Paneli</div>
              <button
                className="p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoClose className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="text-lg text-gray-600" />
                  <span className="text-gray-800">{item.text}</span>
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 p-4 text-red-500 hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Çıkış yap</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
