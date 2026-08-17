import { type ButtonHTMLAttributes } from 'react'
import GlassSvgBtn from './GlassSvgBtn'
import BackButtonSvg from '../svgs/BackButtonSVG'

type Props  = ButtonHTMLAttributes<HTMLButtonElement> ;


const BackButton = (props: Props) => {
  return (
   <GlassSvgBtn {...props}>
        <BackButtonSvg />
      </GlassSvgBtn>
  )
}

export default BackButton