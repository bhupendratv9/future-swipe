import { motion, AnimatePresence } from "motion/react";
import GenerateImage, {
  type GenerateImageRef,
} from "@/components/custom/insight/GenerateImage.tsx";
import React from "react";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton.tsx";
import type { InsightData } from "@/types/result";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import {useTranslation} from "react-i18next";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: InsightData;
};

export default function ImageShareDrawer({ isOpen, onClose, data }: Props) {
  const generateRef = React.useRef<GenerateImageRef>(null);

  const {i18n} = useTranslation()

  const { data:content } = useQuery({
    queryKey: ["button_page", i18n.language],
    queryFn: () => getPageContent("button_page", getAppLanguage()),
  });

  const handleShare = async () => {
    if (navigator.share) {
      const dataUrl = await generateRef.current?.generateImage();

      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "result.png", { type: blob.type });

      const text = `Check out my result!`

      await navigator.share({
        files: [file],
        text: text,
        title: "My Result",
        url: import.meta.env.VITE_BASE_URL,
      });
    } else {
      await navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.6, 0, 0.2, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 300 }} // limit drag
            dragElastic={0.2}
            onDragEnd={(_event, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) {
                onClose(); // close if pulled down enough
              }
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            className="fixed bottom-0 left-0 right-0 max-h-[95vh] z-50 bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px lg:pt-px lg:p-0 rounded-t-[30px] lg:rounded-none"
            style={{ backgroundColor: "#101010" }}
          >
            <div className="bg-black rounded-t-[30px] lg:rounded-none p-5 text-white font-montserrat">
              <div className="space-y-2.5 max-w-70 mx-auto">
                <div className="flex items-center justify-center">
                  <div className="mx-auto mb-4 h-1 w-25 rounded-full bg-[#333333] cursor-grab active:cursor-grabbing" />
                </div>
                <div className="flex justify-center">
                  <GenerateImage data={data} ref={generateRef} />
                </div>

                <div className="h-0.5 w-full rounded-full bg-[#333333]" />
                <div className="flex justify-center">
                  <GradientAnimatedButton
                    buttonText={content?.data?.share.label}
                    className="max-w-70 mx-auto"
                    onClick={handleShare}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
