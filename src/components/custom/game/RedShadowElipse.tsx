import { cn } from '@/lib/utils'

type Props = {
      className?: string
}

const RedShadowElipse = ({className}: Props) => {
  return (
     <svg
    xmlns="http://www.w3.org/2000/svg"
    width="755"
    height="1024"
    fill="none"
          viewBox="0 0 755 1024"
          className={cn('absolute top-0', className)}
          
  >
    <g filter="url(#filter0_f_281_1188)">
      <ellipse
        cx="377.2"
        cy="483"
        fill="#F80000"
        fillOpacity="0.4"
        rx="89"
        ry="256"
      ></ellipse>
    </g>
    <defs>
      <filter
        id="filter0_f_281_1188"
        width="754.4"
        height="1088.4"
        x="0"
        y="-61.2"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          result="effect1_foregroundBlur_281_1188"
          stdDeviation="144.1"
        ></feGaussianBlur>
      </filter>
    </defs>
  </svg>
  )
}

export default RedShadowElipse