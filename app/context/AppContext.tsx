import React, { createContext, useContext, useState, useMemo } from "react";
import { useColorScheme } from "react-native";
import { App_Max_Scale, App_Min_Scale } from "../utils/constant";
import { COLORS } from "../utils/theme";
import { lang as langPun } from "../assets/lang/pun";
import { lang as langEn } from "../assets/lang/en";

type ThemeName =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "dark";

export type DisplayPreferences = {
  showEnglish: boolean;
  showPunjabi: boolean;
  showHindi: boolean;
  showTransliteration: boolean;
};

type AppContextType = {
  // text
  textScale: number;
  setAppTextScale: (scale: number) => void;

  // theme
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  colors: typeof COLORS.default;

  // display preferences
  displayPreferences: DisplayPreferences;
  setDisplayPreference: (key: keyof DisplayPreferences, value: boolean) => void;

  // system
  isDarkMode: boolean;

  // lang
  lang: any;
  setLang: (lang: any) => void;
  switchLang: () => void
};

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  /* ---------------- TEXT SCALE ---------------- */
  const [textScale, setTextScale] = useState(1.2);

  const setAppTextScale = (scale: number) => {
    if (scale > App_Max_Scale || scale < App_Min_Scale) return;
    setTextScale(scale);
  };

  /* ---------------- DISPLAY PREFERENCES ---------------- */
  const [displayPreferences, setDisplayPreferences] = useState<DisplayPreferences>({
    showEnglish: true,
    showPunjabi: true,
    showHindi: true,
    showTransliteration: true,
  });

  const setDisplayPreference = (key: keyof DisplayPreferences, value: boolean) => {
    setDisplayPreferences(prev => ({ ...prev, [key]: value }));
  };

  /* ---------------- THEME ---------------- */
  const [theme, setTheme] = useState<ThemeName>("default");

  /* ---------------- SYSTEM ---------------- */
  const isDarkMode = useColorScheme() === "dark";

  /* ---------------- DERIVED COLORS ---------------- */
  const colors = useMemo(() => {
    return COLORS[theme];
  }, [theme]);

  /* ---------------- lang  ---------------- */
  const [lang, setLang] = useState(langPun);

  const switchLang = () => {
    setLang(lang === langPun ? langEn : langPun);
  };

  return (
    <AppContext.Provider
      value={{
        textScale,
        setAppTextScale,
        theme,
        setTheme,
        colors,
        displayPreferences,
        setDisplayPreference,
        isDarkMode,
        lang,
        setLang,
        switchLang
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* ---------------- CUSTOM HOOK ---------------- */
export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppContextProvider");
  }
  return ctx;
};
