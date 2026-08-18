import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import dashboardEn from "@/i18n/dashboard/en.json";
import dashboardHn from "@/i18n/dashboard/hi.json";
import howToPlayEn from "@/i18n/how-to-play/en.json";
import howToPlayHn from "@/i18n/how-to-play/hi.json";
import homeEn from "@/i18n/home/en.json";
import homeHn from "@/i18n/home/hi.json";
import resultEn from "@/i18n/result/en.json";
import resultHn from "@/i18n/result/hi.json";
import buttonEn from "@/i18n/buttons/en.json";
import buttonHn from "@/i18n/buttons/hi.json";
import profileEn from "@/i18n/profile/en.json";
import profileHn from "@/i18n/profile/hi.json";
import authEn from "@/i18n/auth/en.json";
import authHn from "@/i18n/auth/hi.json";
import gameplayEn from "@/i18n/gameplay/en.json";
import gameplayHn from "@/i18n/gameplay/hi.json";
import quizEn from "@/i18n/quiz/en.json";
import quizHn from "@/i18n/quiz/hi.json";
import stepTwoEn from "@/i18n/step-two/en.json";
import stepTwoHn from "@/i18n/step-two/hi.json";

i18n
  .use(LanguageDetector) // localStorage first; otherwise Hindi (lng / html lang)
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        dashboard: dashboardEn,
        howToPlay: howToPlayEn,
        home: homeEn,
        result: resultEn,
        buttons: buttonEn,
        profile: profileEn,
        auth: authEn,
        gameplay: gameplayEn,
        quiz: quizEn,
        stepTwo: stepTwoEn,
      },
      hi: {
        dashboard: dashboardHn,
        howToPlay: howToPlayHn,
        home: homeHn,
        result: resultHn,
        buttons: buttonHn,
        profile: profileHn,
        auth: authHn,
        gameplay: gameplayHn,
        quiz: quizHn,
        stepTwo: stepTwoHn,
      },
    },
    lng: "hi",
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    detection: {
      // First visit → Hindi. Saved toggle (EN/HI) still wins on later visits.
      // Do not use navigator — English Chrome would override the Hindi default.
      order: ["localStorage", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;
