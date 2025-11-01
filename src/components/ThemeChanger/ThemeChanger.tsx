"use client";
import { useTheme } from "next-themes";
import { useEffect, useEffectEvent, useState } from "react";

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
      The current theme is: {theme}
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
};
