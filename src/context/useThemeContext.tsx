import React, { createContext, useContext, useState, ReactNode } from "react";
import { ThemeColor } from "../services/props";
import { useSettingsContext } from "./useSettingsContext";

const IntTheme: ThemeColor = {
  dark: "#002c3a",
  semidark: "#004054",
  standard: "#006480",
  semilight: "#336676",
  light: "#deebfc"
  //light: "#a2cad2",

};
const AgiTheme: ThemeColor = {
  dark: "#0a2f1c",
  semidark: "#0d5030",
  standard: "#2f6b48",
  semilight: "#3d7359",
  light: "#C6E7CE"
  //light: "#a9d8bf",
};

const StrTheme: ThemeColor = {
  dark: "#3a0000",
  semidark: "#540000",
  standard: "#903333",
  semilight: "#763333",
  light: "#f7d8dc",
  //light: "#d7b0b0",
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
    default:
      alert("Erro ao selecionar o Tema");
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
    throw new Error("useTheme deve ser usando dentro de um ThemeProvider");
  }
  return context;
};
