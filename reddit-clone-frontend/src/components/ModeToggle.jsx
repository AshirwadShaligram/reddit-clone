"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        thumbIcon={
          isDark ? (
            <Moon className="h-3 w-3 text-white" />
          ) : (
            <Sun className="h-3 w-3" />
          )
        }
        aria-label="Toggle dark mode"
      />
    </div>
  );
}
