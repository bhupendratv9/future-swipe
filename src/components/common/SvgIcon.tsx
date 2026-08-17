import * as React from "react";

import questionSvg from "../../assets/svg/question.svg";
import gameSvg from "../../assets/svg/game.svg";
import profileSvg from "../../assets/svg/profile.svg";
import shareSvg from "../../assets/svg/share.svg";

type ImageIconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  variant: "question" | "game" | "profile" | "share";
  onClick?: () => void;
  className?: string;
};

const imageMap: Record<ImageIconProps["variant"], string> = {
  question: questionSvg, // replace with your actual image paths
  game: gameSvg,
  profile: profileSvg,
  share: shareSvg,
};

function SvgIcon({ variant, onClick, className, ...props }: ImageIconProps) {
  return (
    <img
      src={imageMap[variant]}
      alt={variant}
      width={40}
      height={40}
      style={{ cursor: onClick ? "pointer" : "default" }}
      className={`${className || ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      {...props}
    />
  );
}

export default SvgIcon;
