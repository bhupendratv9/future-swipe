import { createFileRoute, Link } from "@tanstack/react-router";
import RingFramesWithOrbit from "../components/common/RingFramesWithOrbit";
import Softbadge from "../components/common/SoftBadge";
import { Container } from "../components/layout/Container";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton";

import c11 from "@/assets/svg/circle/c11.webp";
import c12 from "@/assets/svg/circle/c12.webp";
import c13 from "@/assets/svg/circle/c13.webp";
import c14 from "@/assets/svg/circle/c14.webp";
import c21 from "@/assets/svg/circle/c21.webp";
import c22 from "@/assets/svg/circle/c22.webp";
import c31 from "@/assets/svg/circle/c31.webp";
import c32 from "@/assets/svg/circle/c32.webp";
import c33 from "@/assets/svg/circle/c33.webp";
import c34 from "@/assets/svg/circle/c34.webp";
import { Vstack } from "@/components/layout/Vstack";
import { useTranslation } from "react-i18next";
import MultiLanguage from "@/components/common/MultiLanguage";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import {queryClient} from "@/lib/queryClient.ts";

export const Route = createFileRoute("/")({
  beforeLoad:async () => {
    await queryClient.ensureQueryData({
      queryKey: ["home_page", getAppLanguage()],
      queryFn: () => getPageContent("home_page", getAppLanguage()),
    })
  },
  component: HomePage,
});

function HomePage() {
    const { i18n } = useTranslation("home");

  const { data } = useQuery({
    queryKey: ["home_page", i18n.language],
    queryFn: () => getPageContent("home_page", getAppLanguage()),
  });

  return (
    //  <div className="bg-background-primary h-screen lg:h-auto ">
    <div className="bg-background-primary h-screen min-[495px]:overflow-y-auto min-[495px]:overflow-x-hidden lg:overflow-hidden">  
   {/* <div className="bg-background-primary h-screen min-[1155px]:h-auto"> */}
      <Container>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 max-w-7xl w-full flex justify-end pt-7.5 px-4 z-20">
          <MultiLanguage />
        </div>
        <Vstack>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 py-10 lg:py-14 lg:-mt-15 ">
          {/* Ring - centered on mobile, left on desktop */}
          <div className="flex justify-center lg:justify-start shrink-0 ">
            <RingFramesWithOrbit
              // ringSizes={[667, 515, 363, 235]}
              orbitImages={[
                [c31, c32, c33, c34],
                [c21, c22],
                [c11, c12, c13, c14],
                [],
              ]}
              orbitDuration={[26, 21, 16, 8]}
            />
          </div>

          {/* Text content - centered on mobile, left on desktop */}
          <div className="flex flex-col items-center lg:items-start gap-5 lg:ml-10 ">
            <Softbadge className=" -mt-22 z-1 lg:translate-y-15 lg:-translate-x-30">
           {data?.data?.badge}
            </Softbadge>

            <h1 className="h2 text-center lg:text-left max-w-76.25  lg:max-w-100 lg:mt-15 mt-4">
             {data?.data?.heading}
            </h1>

            {/* Button  */}
            <Link to="/dashboard">
              <div className="w-full max-w-sm  lg:w-107 lg:mt-8">
                <GradientAnimatedButton
                    buttonText={data?.data?.button}
                  className="w-87.5"
                />
              </div>
            </Link>
          </div>
        </div>
        </Vstack>
      </Container>
    </div>
  );
}



