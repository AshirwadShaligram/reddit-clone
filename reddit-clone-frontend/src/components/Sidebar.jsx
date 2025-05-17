"use client";
import { useEffect, useState } from "react";
import { Handshake, House, List, Plus, Telescope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/axiosInstance";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const pathname = usePathname();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get("/api/communities/");

        // Handle different response structures
        if (Array.isArray(response.data)) {
          setCommunities(response.data);
        } else if (response.data && response.data.data) {
          // If the data.data is an object with numeric keys (not a true array)
          if (
            typeof response.data.data === "object" &&
            !Array.isArray(response.data.data)
          ) {
            // Convert object with numeric keys to array
            const communitiesArray = Object.values(response.data.data);
            setCommunities(communitiesArray);
          } else if (Array.isArray(response.data.data)) {
            // If it's already an array
            setCommunities(response.data.data);
          } else {
            setCommunities([]);
          }
        } else {
          console.error("Unexpected API response format:", response.data);
          setCommunities([]);
        }
      } catch (err) {
        console.error("Error fetching communities:", err);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const isActive = (path) => {
    return (
      pathname === path ||
      (path === "/" && pathname === "/home") ||
      (path !== "/" && pathname.startsWith(path))
    );
  };

  // Filter communities created by the current user
  const userCommunities = Array.isArray(communities)
    ? communities.filter((community) => community.createdBy?.id === user?.id)
    : [];

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
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
      <div className="px-4 py-2 border-t border-gray-200 flex-grow">
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

          {/* User's communities */}
          {loading ? (
            <li className="px-3 py-2 text-sm text-gray-500">Loading...</li>
          ) : userCommunities.length > 0 ? (
            userCommunities.map((community) => (
              <li key={community.id}>
                <Link
                  href={`/communities/${community.id}`}
                  className={`flex items-center p-3 rounded-lg ${
                    pathname === `/communities/${community.id}`
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                    {community.logo ? (
                      <img
                        src={community.logo}
                        alt={`${community.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-600">
                        {community.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-sm truncate">
                    {community.name}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">
              No communities created
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
