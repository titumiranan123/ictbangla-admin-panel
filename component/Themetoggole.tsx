'use client'
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaSun, FaMoon } from "react-icons/fa";
import { toggleTheme } from "@/redux/features/themeSlice";
import { RootState } from "@/redux/store";

const ThemeToggle:React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition"
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;
