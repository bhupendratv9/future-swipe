import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { motion, AnimatePresence } from "framer-motion";

import GlobeIconSVG from "../svgs/icons/GlobeIconSVG";

const MultiLanguage = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const clearSwipes = useSwipeStore((state) => state.clearSwipes);

  const changeLanguage = (lng: string) => {
    // clearSwipes();
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const currentLang = i18n.resolvedLanguage || "en";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <div className="relative z-999" ref={dropdownRef}>
      {/* Globe Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 flex items-center gap-3 rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition cursor-pointer"
      >
        <GlobeIconSVG />
        {/* Selected Language */}
        <div className="flex gap-1 items-center">
          <span className="span-regular font-light">
            {currentLang === "en" ? "English" : "हिन्दी"}
          </span>
          {/* Dropdown Icon */}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[9999] right-0 mt-1 w-32 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden"
          >
            <button
              onClick={() => changeLanguage("en")}
              className={`w-full text-left px-3 py-2 transition-colors ${
                currentLang === "en"
                  ? "bg-amber-800 text-white"
                  : "text-white hover:bg-white/20"
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("hi")}
              className={`w-full text-left px-3 py-2 transition-colors ${
                currentLang === "hi"
                  ? "bg-amber-800 text-white"
                  : "text-white hover:bg-white/20"
              }`}
            >
              हिन्दी
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiLanguage;
