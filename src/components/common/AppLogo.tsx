import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type LinkProps, useRouter } from "@tanstack/react-router";
import { memo } from "react";
import FutureSwipeLogoSvg from "@/components/svgs/FutureSwipeLogoSVG.tsx";

type AppLogoProps = {
  variant?: "static" | "animated";
  className?: string;
};

function AppLogo({ variant = "static", className }: AppLogoProps) {
  const baseClasses =
    "will-change-transform object-cover object-center w-auto h-full";

  const router = useRouter();

  const restrictedPaths: LinkProps["to"][] = [
    "/gameplay",
    "/step-two",
    "/step-three",
  ];

  const isRestrictedPath = restrictedPaths.includes(
    router?.history?.location?.pathname as LinkProps["to"],
  );

  const navigateToHome = () => {
    if (!isRestrictedPath) {
      router.navigate({ to: "/" });
    }
  };

  return (
    <button onClick={() => navigateToHome()}>
      <div
        className={cn(
          "w-27 h-10 lg:w-33.75 lg:h-12.5",
          className,
          isRestrictedPath ? "cursor-none" : "cursor-pointer",
        )}
      >
        {variant === "animated" ? (
          <motion.div
            initial={{ x: 200, scale: 1.4, y: 20 }}
            animate={{ x: 0, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className={baseClasses}
          >
            <FutureSwipeLogoSvg />
          </motion.div>
        ) : (
          <motion.div className={baseClasses}>
            <FutureSwipeLogoSvg />
          </motion.div>
        )}
      </div>
    </button>
  );
}
export default memo(AppLogo);
