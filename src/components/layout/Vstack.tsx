import { cn } from "@/lib/utils"

type SectionProps = {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: "py-6 sm:py-8 lg:py-12",
  md: "py-10 sm:py-14 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-28",
}

export function Vstack({ children, size = "md", className }: SectionProps) {
  return (
    <section className={cn(sizes[size], className)}>
      {children}
    </section>
  )
}