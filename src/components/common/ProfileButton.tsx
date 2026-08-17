
import type { ButtonHTMLAttributes } from 'react';
import GlassSvgBtn from './GlassSvgBtn'
import ProfileIconSVG from '../svgs/icons/ProfileIconSVG';
import {useRouter} from "@tanstack/react-router";

type Props  = ButtonHTMLAttributes<HTMLButtonElement> ;

const ProfileButton = (props: Props) => {
  const router = useRouter();
  return (
       <GlassSvgBtn onClick={() => {router.navigate({to: "/profile"})}} {...props}>
        <ProfileIconSVG />
      </GlassSvgBtn>
  )
}

export default ProfileButton