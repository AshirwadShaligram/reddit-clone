"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Home = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
    // Close right sidebar when opening left on mobile
    if (!leftSidebarOpen && rightSidebarOpen) {
      setRightSidebarOpen(false);
    }
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    // Close left sidebar when opening right on mobile
    if (!rightSidebarOpen && leftSidebarOpen) {
      setLeftSidebarOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Mobile Left Sidebar Toggle Button */}
      <button
        className="fixed top-20 left-4 z-50 p-2 rounded-full text-white sm:hidden"
        onClick={toggleLeftSidebar}
      >
        {leftSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Right Sidebar Toggle Button */}
      <button
        className="fixed top-20 right-4 z-50  p-2 rounded-full text-white sm:hidden"
        onClick={toggleRightSidebar}
      >
        {rightSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main container */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Left Sidebar - Always visible on desktop, slides in on mobile */}
        <div
          className={`
          bg-primary text-primary-foreground w-60 fixed sm:relative 
          h-full z-40 transition-all duration-300 ease-in-out
          ${leftSidebarOpen ? "left-0" : "-left-60"} 
          sm:left-0
        `}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Left Sidebar</h2>
            <p>Sidebar content goes here</p>
          </div>
        </div>

        {/* Main Content - Always visible */}
        <div className="flex-grow bg-amber-200 min-h-screen p-4 sm:p-6 transition-all duration-300 ease-in-out">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Main Content</h1>
            <p>
              This is the main content area. It will always be visible and will
              resize based on whether the sidebars are showing.
            </p>
          </div>
        </div>

        {/* Right Sidebar - Always visible on desktop, slides in on mobile */}
        <div
          className={`
          bg-primary text-primary-foreground w-60 fixed sm:relative 
          h-full z-40 transition-all duration-300 ease-in-out
          ${rightSidebarOpen ? "right-0" : "-right-60"} 
          sm:right-0 top-0
        `}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Right Sidebar</h2>
            <p>Sidebar content goes here</p>
          </div>
        </div>
      </div>

      {/* Overlay that appears when sidebar is open on mobile */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Home;
