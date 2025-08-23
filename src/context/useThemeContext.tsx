import React, { createContext, useContext, useState, ReactNode } from "react";
import { ThemeColor } from "../services/props";
import { useSettingsContext } from "./useSettingsContext";

const IntTheme: ThemeColor = {
  dark: "#002c3a",
  semidark: "#004054",
  standard: "#006480",
  semilight: "#336676",
  light: "#deebfc",
};
const AgiTheme: ThemeColor = {
  dark: "#0a2f1c",
  semidark: "#0d5030",
  standard: "#2f6b48",
  semilight: "#3d7359",
  light: "#DAF1DB",
};

const StrTheme: ThemeColor = {
  dark: "#3a0000",
  semidark: "#540000",
  standard: "#903333",
  semilight: "#763333",
  light: "#FBEAEC",
};

const TheInternationalTheme: ThemeColor = {
  dark: "#2e0e4e",
  semidark: "#400e75",
  standard: "#6c1cc2",
  semilight: "#764da1",
  light: "#ebdcfc",
};
interface ThemeContextType {
  ColorTheme: ThemeColor;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { globalTheme } = useSettingsContext();

  var ColorTheme = IntTheme;

  switch (globalTheme) {
    case "int":
      ColorTheme = IntTheme;
      break;
    case "agi":
      ColorTheme = AgiTheme;
      break;
    case "str":
      ColorTheme = StrTheme;
      break;
    case "ti2025":
      ColorTheme = TheInternationalTheme;
    default:
      ColorTheme = TheInternationalTheme;
  }

  return (
    <ThemeContext.Provider value={{ ColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used in ThemeProvider");
  }
  return context;
};
