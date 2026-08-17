import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  innerClass?: string;

};

const GradientCard = ({ children, className,innerClass }: Props) => {
  return (
    <div className={cn("bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px w-full" +
      " shadow-2xl shadow-black/10 squircle", className)}>
      <div className="size-full bg-black squircle">
        <div className={cn("size-full bg-linear-to-b from-secondary/7 to-[#5CE1E6]/7 squircle p-5" +
          " lg:p-7.5",innerClass)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default GradientCard;
