import { memo } from "react";

type ProgressBarProps = {
  total?: number;
current?: number;
};

const QuizProgressBar = ({ total = 10, current = 0 }: ProgressBarProps) => {


  return (
    <div className=" relative w-full lg:w-[332px] z-50">
      <p className="p-light flex justify-end mb-2">{current} / <span className="text-[#FFFFFF80]">{total}</span></p>
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

export default memo(QuizProgressBar)