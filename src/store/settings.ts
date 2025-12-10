import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageProps, ThemeProps } from "@src/services/props";

type SettingsStore = {
  englishLanguage: boolean;
  globalTheme: ThemeProps;
  setEnglishLanguage: (isEnglish: boolean) => void;
  setGlobalTheme: (theme: ThemeProps) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      englishLanguage: true,
      globalTheme: "int",

      setEnglishLanguage: (value) => set({ englishLanguage: value }),
      setGlobalTheme: (theme) => set({ globalTheme: theme }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        englishLanguage: state.englishLanguage,
        globalTheme: state.globalTheme,
      }),
    }
  )
);
