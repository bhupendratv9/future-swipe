import { useSwipeStore } from "@/store/swipeStore";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from "motion/react";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  card: { id: number; photo: string };
  index: number;
  onSwipe: () => void;
  triggerSwipe: "left" | "right" | null;
  clearTrigger: () => void;
  swipeX?: MotionValue<number>;
};

const getRotation = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return -4;
  if (index === 2) return 4;
  return 0;
};

function SwipeCard({
  card,
  index,
  onSwipe,
  triggerSwipe,
  clearTrigger,
  swipeX,
}: Props) {
  const addSwipe = useSwipeStore((state) => state.addSwipe);
  const [showImage, setShowImage] = useState(false);
  // Use sharedX if provided (top card), else use local value for background fly-in
  const localX = useMotionValue(0);
  const x = swipeX || localX;

  const dragRotate = useTransform(x, [-200, 200], [-25, 25]);
  // Diagonal movement derived from X (NO vertical drag)
  const y = useTransform(x, [-200, 0, 200], [50, 0, 50]);
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);
  const isTop = !!swipeX;

  // Reusable swipe function
  const performSwipe = useCallback(
    (dir: "left" | "right") => {
      animate(x, dir === "right" ? 600 : -600, {
        onComplete: () => {
          //store swipe in Zustand
          addSwipe(card.id.toString(), dir === "right" ? "like" : "dislike");
          onSwipe();
          clearTrigger();
        },
      });
    },
    [clearTrigger, onSwipe, x],
  );

  // Handle button clicks
  useEffect(() => {
    if (isTop && triggerSwipe) performSwipe(triggerSwipe);
  }, [triggerSwipe, isTop, performSwipe]);

  // Initial Entry Animation (Fly-in)
  // useEffect(() => {
  //   animate(x, 0, {
  //     type: "spring",
  //     stiffness: 80,
  //     damping: 20,
  //     delay: index * 0.08,
  //   });
  // }, []);

  return (
    <motion.div
      initial={{ x: index % 2 === 0 ? -200 : 200, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        rotate: isTop ? 0 : getRotation(index),
      }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: index * 0.08,
      }}
      drag={isTop ? "x" : false}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (!isTop) return;
        if (info.offset.x > 120) performSwipe("right");
        else if (info.offset.x < -120) performSwipe("left");
        else animate(x, 0, { type: "spring" });
      }}
      onAnimationComplete={() => {
        setShowImage(true);
      }}
      style={{
        x,
        y,
        rotate: isTop ? dragRotate : undefined,
        scale: isTop ? scale : undefined,
        zIndex: 100 - index,
      }}
      className="will-change-transform absolute w-full h-full rounded-[28px] overflow-hidden bg-white  cursor-grab active:cursor-grabbing touch-none shadow-[0px_8px_15.5px_0px_rgba(0,0,0,0.25)]"
    >
      {showImage ? (
        <img
          src={card.photo}
          alt="card"
          className="border-[6px] rounded-[28px] border-white w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
    </motion.div>
  );
}

export default React.memo(SwipeCard);
