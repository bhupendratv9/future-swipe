

export const getHeadingFont = (lang: string) =>
    lang === "hi" ? "font-devnagari" : "font-[Unbounded]";

// usec case in componet 
// const { i18n } = useTranslation();

// <h1 className={`h1 ${getHeadingFont(i18n.language)}`}>
//   Title
// </h1>