import i18n from "i18next";

export const getAppLanguage = () => {
  if (!i18n.isInitialized) return "hi";

  return (
    i18n.resolvedLanguage ||
    i18n.language?.split("-")[0] ||
    "hi"
  );
};