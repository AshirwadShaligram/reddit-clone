"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile Left Sidebar Toggle Button */}
      <button
        className={`fixed top-24 left-4 z-50 p-2 rounded-full bg-gray-800 text-white sm:hidden ${
          leftSidebarOpen ? "hidden" : "block"
        }`}
        onClick={toggleLeftSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Main container */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Left Sidebar */}
        <div
          className={`
            fixed sm:relative h-full z-40 transition-all duration-300 ease-in-out
            ${leftSidebarOpen ? "left-0" : "-left-64"} 
            sm:left-0
          `}
        >
          {/* Close button positioned at top-right inside sidebar */}
          <button
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-800 text-white sm:hidden"
            onClick={toggleLeftSidebar}
          >
            <X size={24} />
          </button>
          <Sidebar />
        </div>

        {/* Main Content - Scrollable area */}
        <div
          className={`flex-grow h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] ${
            leftSidebarOpen ? "ml-64" : "ml-0"
          } sm:ml-0`}
        >
          <div className="min-h-full p-4 sm:p-6">{children}</div>
        </div>

        {/* Right Sidebar - Only visible on desktop */}
        <div className="hidden sm:block w-60 bg-primary text-primary-foreground h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Right Sidebar</h2>
            <p>Desktop-only sidebar content</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {leftSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleLeftSidebar}
        />
      )}

      {/* Hide scrollbar for Chrome, Safari and Opera */}
      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
