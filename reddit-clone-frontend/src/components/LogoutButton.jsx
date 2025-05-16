import React, { useState } from "react";
import { useLogout } from "@/lib/logoutUser.js";

export function LogoutButton({ className }) {
  const [isLoading, setIsLoading] = useState(false);
  const logoutUser = useLogout();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded ${
        isLoading ? "opacity-70" : ""
      } ${className || ""}`}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
