import { cn } from "@/lib/utils";
import React from "react";

type HeaderProps = {
  className?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const Header = ({ className, left, right }: HeaderProps) => {
  return (
    <>
      <header
        className={cn(
          "max-w-7xl mx-auto py-0 pt-7.5 lg:py-7.5 px-4 flex items-center justify-between relative z-9 border-b border-[#FFFFFF0F]",
          className,
        )}
      >
        <div className="flex items-center">{left}</div>
        <div className="flex items-center gap-5">{right}</div>
      </header>
    </>
  );
};

export default React.memo(Header);
