import { ThemeColor, ThemeProps } from "@src/services/props";
import { create } from "zustand";

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

type ThemeStore = {
  colorTheme: ThemeColor;
  setTheme: (theme: ThemeProps) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  colorTheme: IntTheme,
  setTheme: (theme) => {
    switch (theme) {
      case "int":
        set({ colorTheme: IntTheme });
        break;
      case "agi":
        set({ colorTheme: AgiTheme });
        break;
      case "str":
        set({ colorTheme: StrTheme });
        break;
      case "ti2025":
        set({ colorTheme: TheInternationalTheme });
        break;
      default:
        set({ colorTheme: IntTheme });
    }
  },
}));
