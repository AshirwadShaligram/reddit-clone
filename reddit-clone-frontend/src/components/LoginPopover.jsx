"use client";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export function LoginPopover({ user, onLogin, onSignup }) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("login");
  const [isOpen, setIsOpen] = useState(false);

  // Form state for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Form state for signup
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // // Track popover open/close
  // const handlePopoverOpenChange = (open) => {
  //   setIsOpen(open);
  //   console.log("Popover state changed to:", open ? "open" : "closed");

  //   // Reset to login view when closed
  //   if (!open) {
  //     setCurrentView("login");
  //     console.log("Reset to login view");
  //   }
  // };

  // Log view changes
  useEffect(() => {
    console.log(`View changed to: ${currentView}`);
  }, [currentView]);

  // Handler for login
  const handleLogin = () => {
    console.log("Login form submitted");
    console.log("Email:", loginEmail);
    console.log("Password:", loginPassword);

    if (onLogin) {
      onLogin({ email: loginEmail, password: loginPassword });
    }
  };

  // Handler for signup
  const handleSignup = () => {
    console.log("Signup form submitted");
    console.log("Username:", username);
    console.log("Email:", signupEmail);
    console.log("Password:", signupPassword);

    if (onSignup) {
      onSignup({ username, email: signupEmail, password: signupPassword });
    }
  };

  const showLoginView = () => setCurrentView("login");
  const showSignupView = () => setCurrentView("signup");

  // Log form value changes
  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value);
    console.log("Login email changed:", e.target.value);
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
    console.log("Login password changed:", e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    console.log("Username changed:", e.target.value);
  };

  const handleSignupEmailChange = (e) => {
    setSignupEmail(e.target.value);
    console.log("Signup email changed:", e.target.value);
  };

  const handleSignupPasswordChange = (e) => {
    setSignupPassword(e.target.value);
    console.log("Signup password changed:", e.target.value);
  };

  // Login with social
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleGitHubLogin = () => {
    console.log("GitHub login clicked");
  };

  // Login form content
  const LoginView = (
    <div className="p-6 space-y-4">
      <div className="space-y-2 text-center">
        <h4 className="font-medium leading-none">Sign in to Moshot</h4>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            value={loginEmail}
            onChange={handleLoginEmailChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={loginPassword}
            onChange={handleLoginPasswordChange}
          />
        </div>
        <Button className="w-full" onClick={handleLogin}>
          Sign in
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleGoogleLogin}>
            {/* Google Icon */}
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </Button>
          <Button variant="outline" onClick={handleGitHubLogin}>
            {/* GitHub Icon */}
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              />
            </svg>
            GitHub
          </Button>
        </div>
      </div>
      {/* Create new account */}
      <div className="pt-4 text-center text-sm">
        Don't have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={showSignupView}
        >
          Sign up
        </button>
      </div>
    </div>
  );

  // Signup form content
  const SignupView = (
    <div className="p-6 space-y-4">
      <div className="space-y-2 text-center">
        <h4 className="font-medium leading-none">Create a Moshot account</h4>
        <p className="text-sm text-muted-foreground">
          Enter your details to sign up
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="johndoe"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            placeholder="name@example.com"
            type="email"
            value={signupEmail}
            onChange={handleSignupEmailChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            value={signupPassword}
            onChange={handleSignupPasswordChange}
          />
        </div>
        <Button className="w-full" onClick={handleSignup}>
          Create account
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleGoogleLogin}>
            {/* Google Icon */}
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </Button>
          <Button variant="outline" onClick={handleGitHubLogin}>
            {/* GitHub Icon */}
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              />
            </svg>
            GitHub
          </Button>
        </div>
      </div>
      {/* Back to login */}
      <div className="pt-4 text-center text-sm">
        Already have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={showLoginView}
        >
          Sign in
        </button>
      </div>
    </div>
  );

  // Track popover open/close
  const handlePopoverOpenChange = (open) => {
    console.log("Popover state changed to:", open ? "open" : "closed");
  };

  return (
    <Popover onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 py-1.5 text-sm font-medium"
          onClick={() => console.log("Sign In button clicked")}
        >
          Sign In
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {currentView === "login" ? LoginView : SignupView}
      </PopoverContent>
    </Popover>
  );
}
