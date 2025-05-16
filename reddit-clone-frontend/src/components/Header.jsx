"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slice/authSlice.js"; // Adjust the import path
import {
  Search,
  User,
  ChevronDown,
  Bell,
  LogOut,
  VenetianMask,
  Moon,
} from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { LoginPopover } from "./LoginPopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import api from "@/lib/axiosInstance";

export default function Header() {
  const auth = useSelector((state) => state.auth);
  const [notification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  // Destructure for easier access
  const { user, isAuthenticated } = auth;

  const handleLogout = async () => {
    try {
      // Clear client-side state immediately
      dispatch(logout());

      // Call logout API
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
      // Still ensure user is logged out client-side
      dispatch(logout());
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            Moshot
          </Link>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className="h-4 w-4 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                placeholder="Search Moshot"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User actions */}
            {!user ? (
              <div className="flex space-x-2">
                <LoginPopover
                  // onLogin={handleLogin}
                  user={user}
                  className="px-3 sm:px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </LoginPopover>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                {user === "customer" && (
                  <Link
                    href="/notification"
                    className="p-1.5 relative w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Bell
                      size={20}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    {notification > 0 && (
                      <span className="absolute top-1 right-1 sm:top-1 sm:left-7 bg-blue-600 text-white text-xs rounded-full h-2 w-2 flex items-center justify-center"></span>
                    )}
                  </Link>
                )}

                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-1 focus:outline-none">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <User
                            size={16}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-gray-500 dark:text-gray-400 transition-transform"
                        />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-60 h-80">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className=" h-16">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="text-xl">My Profile</span>
                        <div>
                          <h1>{user.userName}</h1>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className=" h-16">
                        <VenetianMask className="text-foreground" />
                        <span className="ml-4 text-xl">Edit Avatar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className=" h-16">
                        <Moon className="text-foreground" />
                        <span className="ml-4 text-xl">Dark Mode</span>
                        <ModeToggle />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className=" h-16"
                        onClick={handleLogout}
                      >
                        <LogOut className="text-foreground" />
                        <span className="ml-4 text-xl"> Log out</span>

                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
