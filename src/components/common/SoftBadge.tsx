import { cn } from "@/lib/utils.ts"

type SoftbadgeProps = {
    children: React.ReactNode,
    className?: string
}

export default function Softbadge({ children, className  }: SoftbadgeProps) {
  return (
    <div className = {cn(
        "rounded-full flex w-fit items-center justify-center font-medium text-[12px] px-5 py-2.5 gap-2.5 bg-white/20 text-center mx-auto text-[#FFFFFF]",
        className
      )}>
      {children}
    </div>
  )
}