import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import logo from "@/assets/splash/logo.png";
import StrategistCard from "../custom/resultScreen/StrategistCard";
import { insightsData } from "@/data/insights";
import GradientAnimatedButton from "../common/GradientAnimatedButton";
import DegreeCard from "@/components/share-pop-up/card/DegreeCard";
import { degreeCardData } from "@/data/degreeCardData";

import pauseIcon from "@/assets/svg/pasueIcon.svg";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

const gradients = ["gradient-seven"];

const SharePopup = ({ isOpen, onClose }: Props) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const uploadToCloudinary = async (dataUrl: string) => {
    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "my_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzecvxoex/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.secure_url;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const captureScreenshot = async () => {
    const captureTarget = popupRef.current?.querySelector(".capture-content");

    if (!captureTarget || isCapturing) return;

    setIsCapturing(true);

    try {
      await document.fonts.ready;

      const imgs = captureTarget.querySelectorAll("img");
      const promises = Array.from(imgs).map(async (img) => {
        if (img.src.startsWith("data:")) return;
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              img.src = reader.result as string;
              resolve(true);
            };
            reader.readAsDataURL(blob);
          });
        } catch {
          console.warn("Could not clean image:", img.src);
        }
      });

      await Promise.all(promises);

      const dataUrl = await htmlToImage.toPng(captureTarget as HTMLElement, {
        pixelRatio: 2 as number | undefined,
        style: {
          transform: "scale(0.6)",
          transformOrigin: "top left",
        },
      });

      if (dataUrl) {
        await uploadToCloudinary(dataUrl);
      }
    } catch (err: unknown) {
      console.error("Capture Error Detail:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        captureScreenshot();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [captureScreenshot, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.6, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 max-h-[95vh] z-50 rounded-t-3xl overflow-hidden flex flex-col"
            style={{ backgroundColor: "#101010" }}
            ref={popupRef}
          >
            {/* Header */}
            <div className="flex justify-center pt-3 pb-3 shrink-0 bg-[#101010] border-b border-gray-800/50">
              <div
                className="w-12 h-1 bg-gray-600 rounded-full cursor-pointer"
                onClick={onClose}
              />
            </div>

            {/* Content */}
            <div className="w-full flex-1 overflow-y-auto flex flex-col items-center px-3 py-4">
              {/* Capture Box */}
              <div className="capture-content  max-w-sm bg-black rounded-2xl p-3 space-y- shrink-0  w-62.5 scale-80">
                {/* Logo */}
                <div className="flex justify-center">
                  <img src={logo} alt="Logo" className="h-8 object-contain" />
                </div>

                <div className="-mt-10">
                  {/* Strategist Card */}
                  <div className="scale-50 relative right-10 top-4">
                    <StrategistCard />
                  </div>

                  {/* People Like Him */}
                  <div className="-mt-4">
                    <p className="text-white text-sm font-medium pl-2 relative top-2 right-4 scale-70">
                      People like him
                    </p>
                    <div className="flex justify-center gap-4 overflow-x-auto lg:overflow-x-auto scrollbar-hide">
                      {insightsData.slice(0, 1).map((item) => (
                        <div
                          key={item.id}
                          className="relative w-60 h-30.25 overflow-hidden rounded-b-[30px] shrink-0 scale-80"
                        >
                          <div className="absolute bottom-0 left-0 w-auto h-full z-20 pt-6">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black"></div>
                          </div>

                          <div className="relative gradient-insight-border w-full h-full p-4">
                            <div className="ml-auto max-w-[52%] w-full gap-2 flex flex-col">
                              <p className="p-light text-[12px] font-light leading-4.5">
                                {item.description}
                              </p>
                              <h2 className="text-[12px]  text-secondary">
                                {item.name}
                              </h2>
                              <p className="p-ultralight">{item.title}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Careers */}
                  <div className="-mt-3">
                    <p className="text-white text-xs font-unbounded pl-2 relative top-6 right-3 scale-70">
                      Best Careers for You
                    </p>
                    <div className="flex  scrollbar-hide mt-5 pb-2 relative right-3 scale-70">
                      {degreeCardData.map((item, index) => (
                        <DegreeCard
                          key={item.id}
                          duration={item.duration}
                          degree={item.degree}
                          bg={gradients[index % gradients.length]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <div>
                    <div className="scale-60 origin-center -mt-3">
                      <GradientAnimatedButton
                        buttonText="Check your ideal degree now"
                        icon={
                          <img src={pauseIcon} alt="" className="w-5 h-5" />
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SharePopup;
