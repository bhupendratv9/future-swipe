import GlassSvgBtn from "@/components/common/GlassSvgBtn";
import CloseIconSVG from "@/components/svgs/icons/CloseIconSVG";
import { motion } from "motion/react";
import { memo } from "react";

function CloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <GlassSvgBtn>
        <CloseIconSVG />
      </GlassSvgBtn>
    </motion.div>
  );
}
export default memo(CloseButton)