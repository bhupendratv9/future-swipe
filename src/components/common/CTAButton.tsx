import { cn } from "@/lib/utils";
 
type Props = {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  glassEffect?:boolean;
  asChild?: boolean;
};

const CTAButton = ({ className, onClick, disabled, icon, text, type, glassEffect, asChild }: Props) => {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-montserrat text-white text-[16px] font-medium px-4 py-2 rounded-[100px] bg-[#F0F0F04D] flex items-center justify-center gap-2 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        glassEffect && "glass-drop",
        className,
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{text}</span>
    </Comp>
  );
};

export default CTAButton;
