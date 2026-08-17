import { motion, AnimatePresence } from "motion/react";
import logo from "@/assets/splash/logo.png";
import StrategistCard from "../custom/resultScreen/StrategistCard";
import { insightsData } from "@/data/insights";
import GradientAnimatedButton from "../common/GradientAnimatedButton";
import DegreeCard from "./card/DegreeCard";
import { degreeCardData } from "@/data/degreeCardData";


import pauseIcon from "@/assets/svg/pasueIcon.svg";
import facebook from "@/assets/svg/facebook.svg";
import instagram from "@/assets/svg/instagram.svg";
import gmail from "@/assets/svg/gmail.svg";
import whatsapp from "@/assets/svg/whatsapp.svg";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

const shareOptions = [
  { id: 1, name: "Insta", icon: instagram }, 
  { id: 2, name: "WhatsApp", icon: whatsapp },
  { id: 3, name: "Gmail", icon: gmail },
  { id: 4, name: "Instagram", icon: instagram },
  { id: 5, name: "Facebook", icon: facebook },
];

const gradients = ["gradient-seven"];

const SharePopup = ({ isOpen, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.6, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] z-50 rounded-t-3xl overflow-y-auto"
            style={{ backgroundColor: "#101010" }}
          >
           
              <div
              className="flex justify-center pt-4 pb-6 sticky top-0 bg-[#101010] z-10"
              onClick={onClose}
            >
              <div className="w-22 h-0.5 bg-gray-600 rounded-full "></div>
            </div>
            <div className="w-full h-full flex flex-col items-center px-4 pb-12 sm:px-6 lg:px-8 xl:px-16">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-2xl font-montserrat font-medium text-center mb-6 sm:mb-8 tracking-wide">
                Share with your friends
              </h2>

              <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-black rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div className="flex justify-center py-2">
                  <img
                    src={logo}
                    alt="App logo"
                    className="w-24 sm:w-26 md:w-28 h-8 sm:h-10 md:h-11 object-contain"
                  />
                </div>

                <div>
                  <StrategistCard />
                </div>

                <div>
                  <p className="text-white text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6 pl-4 sm:pl-5">
                    People like him
                  </p>

                  <div className="flex gap-4 sm:gap-6  overflow-x-hidden scrollbar-hide ml-2 ">
                    {insightsData.map((item) => (
                      <div
                        key={item.id}
                        className="relative w-[320px] h-50 sm:w-83 md:w-83 lg:w-95 sm:h-50 md:h-55 pt-4  overflow-hidden rounded-b-[30px] shrink-0 "
                      >
                        <div className="absolute bottom-0 left-0 w-auto h-full z-10">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black"></div>
                        </div>

                        <div className="relative gradient-insight-border w-full h-full p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                          <div className="ml-auto max-w-[55%]  mt-4">
                            <p className="text-xs  font-montserrat font-light leading-4 sm:leading-5 text-[#FFFFFF] mb-1">
                              {item.description}
                            </p>
                            <h3 className="text-sm sm:text-base md:text-lg font-medium font-unbounded text-secondary mb-1">
                              {item.name}
                            </h3>
                            <p className="text-xs  text-[#FFFFFF]">
                              {item.title}
                            </p>
                          </div>

                          {/* <GradientAnimatedButton
                            buttonText="94% Match"
                            className="w-auto absolute right-4 sm:right-5 md:right-6 bottom-6 sm:bottom-7 md:bottom-8"
                            textClassName="text-[10px] sm:text-[11px] md:text-[12px] px-2"
                            textGradient="linear-gradient(103.25deg, #757404 33.14%, #1483BF 111.12%)"
                          /> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white text-sm sm:text-base md:text-lg font-unbounded  pl-8 ">
                    Best Careers for Arjun
                  </p>

                  <div className="flex gap-3 sm:gap-4 md:gap-6 flex-row overflow-x-hidden scrollbar-hide px-0 sm:px-0 mt-4 sm:mt-6 md:mt-8">
                    {degreeCardData.map((item, index) => {
                      const gradientClass = gradients[index % gradients.length];
                      return (
                        <DegreeCard
                          key={item.id}
                          duration={item.duration}
                          degree={item.degree}
                          bg={gradientClass}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center pt-4 sm:pt-6 md:pt-8">
                  <GradientAnimatedButton
                    buttonText="Check your ideal degree now"
                    icon={
                      <img
                        src={pauseIcon}
                        alt="icon"
                        className="w-3 sm:w-4 md:w-4 h-3 sm:h-4 md:h-4 object-contain"
                      />
                    }
                  />
                </div>

                
              </div>
                    <div className="w-full mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 md:pt-10">
                  <div className="w-full border border-[#333333] "></div>
                  <div className="flex gap-4 overflow-x-hidden scrollbar-hide mt-5">
                    {shareOptions.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center min-w-16 cursor-pointer group"
                      >
                        <div className="w-17 h-17 sm:w-16 sm:h-16 rounded-xl  flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          {item.icon && (
                            <img
                              src={item.icon}
                              alt={item.name}
                              className="w-20 h-20 object-contain"
                            />
                          ) }
                        </div>

                        <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center leading-tight">
                          {item.name}
                        </p>
                      </div>
                    ))}
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
