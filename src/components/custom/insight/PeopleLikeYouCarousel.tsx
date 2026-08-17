import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { Insight, InsightResponse } from "@/types/result.ts";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton.tsx";
import { Navigation } from "swiper/modules";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

type PeopleLikeYouCarouselProps = {
  data: InsightResponse;
};

export default function PeopleLikeYouCarousel({
  data,
}: PeopleLikeYouCarouselProps) {
  const { i18n } = useTranslation();

  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data;
  return (
    <div>
      <>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="h3 mb-6">{pageContent?.insight.quoteHeading}</h2>
          </div>

          <div className="hidden gap-4 md:flex">
            <BackButton className="bestfit-prev z-10 [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:pointer-events-none" />
            <BackButton className="bestfit-next rotate-180  z-10  [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:pointer-events-none" />
          </div>
        </div>
      </>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".bestfit-prev",
          nextEl: ".bestfit-next",
        }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 },
          400: { slidesPerView: 1.1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {data?.data?.insights?.map((insight: Insight, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="relative w-84.5 h-40.25 lg:h-50 overflow-hidden rounded-b-[30px] rounded-tr-[30px] bg-linear-to-b from-secondary to-[#201F01] p-[1.3px]">
                <div className="flex h-full bg-black rounded-b-[30px] rounded-tr-[30px] overflow-hidden relative">
                  {/* Image */}
                  <div className="w-[46%] h-full overflow-hidden">
                    <img
                      src={insight.image}
                      alt={insight.name}
                      className=" h-full object-cover block"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black pointer-events-none"></div>
                  </div>

                  {/* Text */}
                  <div className="w-[54%] -ml-4 h-full flex flex-col justify-center py-2 overflow-hidden relative z-2">
                    <p className="text-sm">{pageContent?.insight.quote}</p>
                    <h2 className="text-secondary font-semibold truncate">
                      {insight.name}
                    </h2>
                    <p className="text-xs line-clamp-2">{insight.title}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
