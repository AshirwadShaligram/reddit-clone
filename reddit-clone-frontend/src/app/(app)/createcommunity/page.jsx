"use client";
import { useState, useRef } from "react";
import { ArrowUpCircle, Plus, Lock, Globe, Image, User } from "lucide-react";
import api from "@/lib/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function CreateCommunity() {
  const user = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
    bannerImage: null,
    logoImage: null,
  });
  const [previews, setPreviews] = useState({
    banner: null,
    logo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [type]: reader.result });
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        [`${type}Image`]: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("isPublic", formData.isPublic);
    if (formData.bannerImage) {
      form.append("bannerImage", formData.bannerImage);
    }
    if (formData.logoImage) {
      form.append("logoImage", formData.logoImage);
    }

    try {
      const res = await api.post("/api/communities/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const community = res.data;

      if (community) {
        toast.success("Community created successfully!");
      }
      // Reset form fields
      setFormData({
        name: "",
        description: "",
        isPublic: true,
        bannerImage: null,
        logoImage: null,
      });
      setPreviews({
        banner: null,
        logo: null,
      });

      // Clear file inputs
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      if (logoInputRef.current) logoInputRef.current.value = "";
    } catch (err) {
      console.error("Community creation failed", err);
      let errorMessage = "Failed to create community";

      if (err.response) {
        if (err.response.data?.errors) {
          errorMessage = err.response.data.errors.join(", ");
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        Create Community
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Banner Image
          </label>
          <div
            className="w-full h-40 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer overflow-hidden relative"
            onClick={() => bannerInputRef.current.click()}
          >
            {previews.banner ? (
              <img
                src={previews.banner}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Image className="w-8 h-8 mb-2" />
                <span>Click to upload banner</span>
              </div>
            )}
            <input
              type="file"
              ref={bannerInputRef}
              onChange={(e) => handleImageChange("banner", e)}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo Image
          </label>
          <div className="flex items-center space-x-4">
            <div
              className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => logoInputRef.current.click()}
            >
              {previews.logo ? (
                <img
                  src={previews.logo}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
              <input
                type="file"
                ref={logoInputRef}
                onChange={(e) => handleImageChange("logo", e)}
                accept="image/*"
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current.click()}
              className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              <ArrowUpCircle className="w-4 h-4 mr-1" />
              Upload Logo
            </button>
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Community Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Awesome Community"
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What's this community about?"
          />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center">
            {formData.isPublic ? (
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            ) : (
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formData.isPublic ? "Public Community" : "Private Community"}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Community"}
        </button>
      </form>
    </div>
  );
}
