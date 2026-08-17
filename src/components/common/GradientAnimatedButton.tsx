import { motion } from "motion/react";
import { cn } from "@/lib/utils.ts";
import React from "react";

type gradientAnimatedButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  buttonText: string;
  className?: string;
  textClassName?: string;
  textGradient?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  varient?: "primary" | "delete";
};

export default function GradientAnimatedButton({
  disabled,
  onClick,
  buttonText,
  className,
  textClassName,
  textGradient,
  icon,
  type = "button",
  varient = "primary",
}: gradientAnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      initial={
        disabled
          ? {
              backgroundImage:
                "linear-gradient(270deg, #A3A3A3, #A3A3A3, #A3A3A3)",
            }
          : {
              backgroundImage:
                "linear-gradient(270deg, #DEDB00, #ffffff, #5CE1E6)",
            }
      }
      animate={
        disabled
          ? {
              backgroundImage: [
                "linear-gradient(270deg, #A3A3A3, #A3A3A3, #A3A3A3)",
                "linear-gradient(270deg, #A3A3A3, #A3A3A3, #A3A3A3)",
                "linear-gradient(270deg, #A3A3A3, #A3A3A3, #A3A3A3)",
              ],
            }
          : {
              backgroundImage: [
                "linear-gradient(270deg, #DEDB00, #ffffff, #5CE1E6)",
                "linear-gradient(270deg, #5CE1E6, #ffffff, #DEDB00)",
                "linear-gradient(270deg, #DEDB00, #ffffff, #5CE1E6)",
              ],
            }
      }
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={cn("w-full rounded-full p-0.5 cursor-pointer", className)}
      onClick={onClick}
    >
      <div
        className={cn(
          "rounded-full text-center font-montserrat font-medium h-full flex items-center justify-center",
          disabled ? "bg-button-secondary" : varient === "primary" ? "bg-[#F0F0F0]": "bg-[#DC5844]",

        )}
      >
        <div
          className={cn(
            "py-1.5 text-lg flex items-center justify-center gap-2",
            varient === "primary" ? "text-black" : "text-white",
            textGradient && "bg-clip-text text-transparent",
            textClassName,
          )}
          style={textGradient ? { backgroundImage: textGradient } : undefined}
        >
          {icon && <span>{icon}</span>}<span>{buttonText}</span>
          
        </div>
      </div>
    </motion.button>
  );
}