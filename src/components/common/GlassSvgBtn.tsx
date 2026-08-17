import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils'; // your cn utility path, adjust if needed

interface GlassBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> { 
  children: ReactNode;
  className?: string;
}

const GlassSvgBtn = ({ children, className, ...props }: GlassBtnProps) => {
  return (
    <button
      {...props}
      className={cn(
        `
          group relative flex items-center justify-center
          w-10 h-10 rounded-full
          transition-transform duration-300 active:scale-95

          bg-[#F0F0F04D] cursor-pointer

          backdrop-blur-xl

          before:absolute before:inset-0 before:rounded-full before:-rotate-45
          before:border-t-[1.5px] before:border-white
          before:content-['']

          shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]

          after:absolute after:inset-0 after:rounded-full after:-rotate-45
          after:border-b-[1.5px] after:border-white
          after:content-['']
        `,
        className // merge any extra classes passed via props
      )}
    
    >
      {children}
    </button>
  );
};

export default GlassSvgBtn;