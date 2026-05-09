const THEME_KEY = "theme";

export const getPreferredTheme = () => {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const initializeTheme = () => {
  const theme = getPreferredTheme();
  applyTheme(theme);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme);
  }
  return theme;
};

export const setTheme = (theme) => {
  applyTheme(theme);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme);
  }
};

export const toggleTheme = () => {
  const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  setTheme(nextTheme);
  return nextTheme;
};
