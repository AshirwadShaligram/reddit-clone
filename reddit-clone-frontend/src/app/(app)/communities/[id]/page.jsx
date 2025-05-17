"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import api from "@/lib/axiosInstance";
import { notFound } from "next/navigation";
import { Globe, Lock, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function CommunityPage({ params }) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const communityId = resolvedParams.id;

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await api.get(`/api/communities/${communityId}`);
        setCommunity(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          notFound();
        }
        setError(err.message || "Failed to fetch community details");
        console.error("Error fetching community details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [communityId]);

  // console.log(community.data);

  if (loading)
    return (
      <div className="p-6 text-gray-500">Loading community details...</div>
    );
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!community) return notFound();

  return (
    <div className="p-6">
      {/* Banner image */}
      <div className="w-full h-48 md:h-64 rounded-lg mb-6 bg-gray-100 overflow-hidden relative">
        {community.data.banner ? (
          <img
            src={community.data.banner}
            alt={`${community.data.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200" />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Community logo and basic info */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
                {community.data.logo ? (
                  <img
                    src={community.data.logo}
                    alt={`${community.data.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {community.data.name}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {community.data.name}
                </h1>
                <div className="flex items-center mt-1">
                  {community.data.isPublic ? (
                    <div className="flex items-center text-blue-500 text-sm">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>Public Community</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Lock className="w-4 h-4 mr-1" />
                      <span>Private Community</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex items-center mb-2 text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {community.memberCount || "0"} members
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Created{" "}
                  {community.data.createdAt
                    ? new Date(community.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>

            {/* Join/Leave button would go here */}
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors">
              Join Community
            </button>
          </div>
        </div>

        {/* Community description and content */}
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">About</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {community.data.description || "No description provided."}
            </p>
          </div>

          {/* Additional sections like rules, recent posts, etc. can be added here */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Community Rules
            </h2>
            <p className="text-gray-500 italic">
              {community.rules
                ? community.rules
                : "No specific rules have been set for this community yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6">
        <Link
          href="/communities"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <span className="mr-1">←</span> Back to Communities
        </Link>
      </div>
    </div>
  );
}
