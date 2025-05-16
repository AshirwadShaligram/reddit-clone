"use client";
import { Handshake, House, List, Plus, Telescope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    return (
      pathname === path ||
      (path === "/" && pathname === "/home") ||
      (path !== "/" && pathname.startsWith(path))
    );
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Main Navigation */}
      <div className="p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/")
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="mr-3 text-lg">
                <House />
              </span>
              <span className="font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/explore"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/explore")
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="mr-3 text-lg">
                <Telescope />
              </span>
              <span className="font-medium">Explore</span>
            </Link>
          </li>
          <li>
            <Link
              href="/communities"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/communities")
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="mr-3 text-lg">
                <Handshake />
              </span>
              <span className="font-medium">Communities</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <span className="mr-3 text-lg">
                <List />
              </span>
              <span className="font-medium">All</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Custom Feeds Section */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
          POST
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              href="/createpost"
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <span className="mr-3 text-lg">
                <Plus />
              </span>
              <span className="font-medium">Create Post</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Communities Section */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
          Communities
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              href="/createcommunity"
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <span className="mr-3 text-lg">
                <Plus />
              </span>
              <span className="font-medium">Create a community</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
