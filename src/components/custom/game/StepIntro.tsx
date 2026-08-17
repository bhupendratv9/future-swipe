import Softbadge from "@/components/common/SoftBadge"

type StepIntroProps = {
  label: string
  title: string
}

export function StepIntro({ label, title }: StepIntroProps) {
 

  return (
    <div className="absolute z-50 flex flex-col items-center">
      <Softbadge className="text-[12px] lg:text-[16px]">
        {label}
      </Softbadge>

      <h2 className="font-[Unbounded] text-[24px] mt-2">
        {title}
      </h2>
    </div>
  )
}