"use client";

import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ExplorePage() {
  const user = useSelector((state) => state.auth);
  console.log(user);

  const handleOnclick = (e) => {
    console.log("button clicked");
    toast.success("Test toast!");
  };

  return (
    <div className="text-center max-w-4xl mx-auto text-background">
      <h1 className="text-2xl font-bold mb-4">Explore Content</h1>
      <p>Discover new and interesting content here.</p>
      <button onClick={handleOnclick} className="mt-4 p-2 bg-gray-200 rounded">
        Test Toast
      </button>
    </div>
  );
}
