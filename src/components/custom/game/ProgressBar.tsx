
import { memo } from "react";

type ProgressBarProps = {
  current?: number;
  total?: number;
  label: string; 
};

const ProgressBar = ({ current = 0, total = 10,label }: ProgressBarProps) => {
  
  return (
    <div className=" relative w-full lg:w-[332px] z-50">
      <div className="flex justify-between items-center">
        <p className="p-light text-[18px] font-medium">{label}</p>
        <p className="p-light flex justify-end mb-2">{current} / <span className="text-[#FFFFFF80]">{total}</span></p>
      
      </div>
      <div className="flex justify-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 w-full rounded-sm transition-colors duration-300 ${
            i < current ? "bg-secondary" : "bg-[#FFFFFF1A]"
          }`}
        />
      ))}
      </div>
    </div>
  )
}

export default memo(ProgressBar)