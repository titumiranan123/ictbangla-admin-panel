import { createSlice } from "@reduxjs/toolkit";

type ThemeState = {
  theme: "light" | "dark";
};

let storedTheme: "light" | "dark" = "light";

// Prevent accessing localStorage on the server
if (typeof window !== "undefined") {
  const themeFromStorage = localStorage.getItem("theme");
  if (themeFromStorage === "dark") {
    storedTheme = "dark";
    document.documentElement.classList.add("dark");
  }
}

const initialTheme: ThemeState = {
  theme: storedTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialTheme,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.theme);
        document.documentElement.classList.toggle("dark", state.theme === "dark");
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.theme);
        document.documentElement.classList.toggle("dark", state.theme === "dark");
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
