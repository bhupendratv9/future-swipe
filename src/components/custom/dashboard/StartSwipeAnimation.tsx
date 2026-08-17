import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import gameSvg from "@/assets/svg/game.svg";
import swipeAvatar from "@/assets/home/swipe-avatar-new.webp";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  title: string;
}

function StartSwipeAnimation({title}:Props) {
  const navigate = useNavigate();
  const controls = useAnimation();
  const abortRef = useRef(false);

  const runLoop = async () => {
    abortRef.current = false;

    while (!abortRef.current) {
      await controls.start("initial");
      await new Promise((r) => setTimeout(r, 600)); // pause before starting

      const steps = ["enter", "center", "action", "exit"];
      for (const step of steps) {
        if (abortRef.current) return;
        await controls.start(step);
        if (abortRef.current) return;
        await new Promise((r) =>
          setTimeout(r, step === "action" ? 400 : 800)
        );
      }

      await new Promise((r) => setTimeout(r, 400)); // pause before restart
    }
  };

  useEffect(() => {
    runLoop();
    return () => {
      abortRef.current = true;
      controls.stop();
    };
  }, []);

  // Variants — unchanged
  const gameVariants = {
    initial: { y: 160 },
    enter: { y: 0, transition: { duration: 0.6 } },
    exit: { y: 160, transition: { duration: 0.5 } },
  };

  const textVariants = {
    initial: { y: 160 },
    enter: { y: 0, transition: { duration: 0.6, delay: 0.04 } },
    exit: { y: 160, transition: { duration: 0.5 } },
  };

  const avatarVariants = {
    initial: { x: -90, y: 220, opacity: 0, scale: 1.3, rotate: 0 },
    enter: {
      y: 50,
      opacity: 1,
      scale: 1.3,
      transition: { duration: 0.6 },
    },
    center: {
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 },
    },
    action: {
      y: 80,
      rotate: -30,
      scale: 1.8,
      transition: { duration: 0.4 },
    },
    exit: {
      x: -90,
      y: 220,
      opacity: 0,
      rotate: 0,
      scale: 1.3,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      onClick={() => navigate({ to: "/gameplay" })}
      className="relative w-full h-83.25 p-5 bg-[linear-gradient(180deg,#32A6B3_22.35%,#0B5177_102.46%)] rounded-tl-[30px] rounded-bl-[30px] rounded-br-[30px] overflow-hidden cursor-pointer"
    >
      <motion.img
        src={gameSvg}
        className="object-contain object-center cursor-pointer"
        variants={gameVariants}
        initial="initial"
        animate={controls}
      />

      <motion.h2
        className="h1 pt-2 cursor-pointer"
        variants={textVariants}
        initial="initial"
        animate={controls}
      >
        {title}
      </motion.h2>

      <motion.img
        src={swipeAvatar}
        className="object-contain object-center absolute bottom-0 w-60.75"
        variants={avatarVariants}
        initial="initial"
        animate={controls}
      />
    </div>
  );
}

export default StartSwipeAnimation;