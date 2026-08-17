import {
  motion,
  useTransform,
  useSpring,
  MotionValue,
  useMotionValueEvent,
} from "motion/react";
import GlassSvgBtn from "@/components/common/GlassSvgBtn";
import ThumbUpIconSVG from "@/components/svgs/icons/ThumbUpIconSVG";
import ThumbDownSVG from "@/components/svgs/icons/ThumbDownSVG";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

type ActionProps = {
  onLike: () => void;
  onDislike: () => void;
  triggerSwipe: "left" | "right" | null;
  swipeX: MotionValue<number>;
};

export default function ActionButtons({
  onLike,
  onDislike,
  triggerSwipe,
  swipeX,
}: ActionProps) {
  const [isDisliking, setIsDisliking] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryKey: ["button_page", i18n.language],
    queryFn: () => getPageContent("button_page", getAppLanguage()),
  });

  // Listen to swipeX changes and update state
  useMotionValueEvent(swipeX, "change", (latest) => {
    // If swiping left past -50px
    setIsDisliking(latest < -50);
    // If swiping right past 50px
    setIsLiking(latest > 50);
  });

  // Raw transform (based on swipe)
  const leftYRaw = useTransform(swipeX, [-150, 0], [-25, 0]);
  const rightYRaw = useTransform(swipeX, [0, 150], [0, -25]);

  // Add smooth spring
  const leftBtnY = useSpring(leftYRaw, {
    stiffness: 300,
    damping: 20,
    mass: 0.5,
  });

  const rightBtnY = useSpring(rightYRaw, {
    stiffness: 300,
    damping: 20,
    mass: 0.5,
  });

  return (
    <div className="max-w-75 relative z-2 w-full flex  justify-between gap-10">
      <motion.div
        style={{ y: leftBtnY }}
        whileTap={{ y: 6 }}
        initial={{ y: 30, opacity: 0 }}
        animate={
          triggerSwipe === "left" ? { y: [0, -30, 0] } : { opacity: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 1 }}
        onClick={onDislike}
        className="will-change-transform flex flex-col justify-center items-center gap-3 cursor-pointer"
      >
        <GlassSvgBtn
          className={` ${isDisliking ? "shadow-[1px_1px_17.2px_1px_#FFFFFFCC]" : ""}`}
        >
          <ThumbDownSVG />
        </GlassSvgBtn>
        <h3 className="h3">{data?.data?.gameplay.dislike}</h3>
      </motion.div>

      <motion.div
        style={{ y: rightBtnY }}
        whileTap={{ y: 6 }}
        initial={{ y: 30, opacity: 0 }}
        animate={
          triggerSwipe === "right" ? { y: [0, -30, 0] } : { opacity: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 1 }}
        onClick={onLike}
        className="flex flex-col justify-center items-center gap-3 cursor-pointer"
      >
        <GlassSvgBtn
          className={` ${isLiking ? "shadow-[1px_1px_17.2px_1px_#FFFFFFCC]" : ""} `}
        >
          <ThumbUpIconSVG />
        </GlassSvgBtn>

        <h3 className="h3">{data?.data?.gameplay.like}</h3>
      </motion.div>
    </div>
  );
}
