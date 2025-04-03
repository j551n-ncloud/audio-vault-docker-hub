
import { useState, useEffect } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then fallback to checking document class
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      return savedMode === "dark";
    }
    return document.documentElement.classList.contains("dark");
  });
  
  // Theme switcher effect with localStorage persistence
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    setIsDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev)
  };
}
