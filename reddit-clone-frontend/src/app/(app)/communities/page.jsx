"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axiosInstance";
import { Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get("/api/communities/");
        // Set communities directly from the response data structure

        setCommunities(response.data);
      } catch (err) {
        console.error("Error fetching communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-500">Loading communities...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Communities</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {communities.data.map((community) => (
          <Link
            key={community.id}
            href={`/communities/${community.id}`}
            className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {community.logo ? (
                  <img
                    src={community.logo}
                    alt={`${community.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {community.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-xs border border-gray-100">
                {community.isPublic ? (
                  <Globe className="w-3 h-3 text-blue-500" />
                ) : (
                  <Lock className="w-3 h-3 text-gray-500" />
                )}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-900 text-center">
              {community.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 text-center truncate max-w-full">
              {community.description?.substring(0, 50)}
              {community.description?.length > 50 ? "..." : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
