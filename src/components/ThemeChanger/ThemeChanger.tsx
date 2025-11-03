"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useEffectEvent, useState } from "react";
import { Button } from "../ui/button";

export const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const handleMount = useEffectEvent(() => {
    setMounted(true);
  });

  useEffect(() => {
    handleMount();
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        type="button"
        variant={"outline"}
        onClick={() =>
          setTheme((prev) => {
            return prev === "dark" ? "light" : "dark";
          })
        }
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
};
