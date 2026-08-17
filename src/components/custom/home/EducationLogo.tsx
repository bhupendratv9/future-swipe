import education from "@/assets/home/Education9_Final.png";
import { cn } from "@/lib/utils";

interface EducationLogoProps {
  className?: string;
}
const EducationLogo = ({ className }: EducationLogoProps) => {
  return (
    <a
      href={"https://www.tv9hindi.com/education"}
      target="_blank"
      className={cn(
        "flex justify-center items-center mt-8 lg:mt-12",
        className,
      )}
    >
      <div>
        <p className="p-ultralight text-center">A product of</p>
        <img src={education} alt="education-9" />
      </div>
    </a>
  );
};

export default EducationLogo;
