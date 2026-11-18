const KEY = "job-application-tracker-theme";

export const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Fall through to the system preference.
  }

  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return "light";
};

export const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
};

export const saveTheme = (theme) => {
  localStorage.setItem(KEY, theme);
};
