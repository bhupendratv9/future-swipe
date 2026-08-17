import GradientCard from "@/components/common/GradientCard";

import GradientAnimatedButton from "@/components/common/GradientAnimatedButton";
import InsightsIconSvg from "@/components/svgs/icons/InsightsIconSVG";
import { Link } from "@tanstack/react-router";
import type { Persona } from "@/types/result";
import { useGetProfileQuery } from "@/queries/get-profile-query";
import { useTranslation } from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

type Props = {
  showButton?: boolean;
  persona?: Persona;
};

const StrategistCard = ({ showButton, persona }: Props) => {
  const { i18n } = useTranslation();
  const { data: profileData } = useGetProfileQuery();

  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data;

  return (
    <GradientCard>
      <div className="grid gap-6 justify-center max-w-3xl w-full">
        <div className="flex justify-center items-center gap-10">
          <div className="w-19.25 lg:w-22 h-20 lg:h-23 shrink-0">
            <img
              src={persona?.photo}
              alt="strategirst-icon"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="h3">
            {profileData?.data?.user?.name} {""}
            {pageContent?.screen.card.shortText}
            <span className="block text-secondary text-[20px] lg:text-[40px] leading-8 lg:leading-14 font-normal">
              {persona?.name ?? "The Strategist"}
            </span>
          </h2>
        </div>
        <p className="p-medium  text-center">{persona?.description}</p>

        {showButton && (
          <Link to="/insight">
            <GradientAnimatedButton
              icon={<InsightsIconSvg fill="black" />}
              buttonText={pageContent?.screen.card.button}
              className=" p-0.5"
              textClassName="py-[14px] px-[18px] gap-6 text-base  font-regular"
            />
          </Link>
        )}
      </div>
    </GradientCard>
  );
};

export default StrategistCard;
