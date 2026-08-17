import { cn } from "@/lib/utils";
import locationIcon from "@/assets/result-unlock/location-icon.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import GlassSvgBtn from "@/components/common/GlassSvgBtn";

import CTAButton from "@/components/common/CTAButton";
import LikeIconSvg from "@/components/svgs/icons/LikeIconSVG";
import StarImg from "@/assets/result/star.png";
import RightArrowSVG from "@/components/svgs/icons/RightArrowSVG";
import type { CourseBase } from "@/types/result";
import React, { useState } from "react";
import RedLikeIconSVG from "@/components/svgs/icons/RedLikeIconSVG";

import { toast } from "sonner";
import { useWishlistToggle } from "@/queries/result.query";
import BackButton from "@/components/common/BackButton";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import { handleImgError } from "@/lib/handleImgError";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

type Props = {
  heading?: string;
  buttons?: boolean;
  cardsData: CourseBase[];
  personaId?: number;
  variant?: "course" | "university" | "wishlist";
  onCardClick?: (id: number) => void;
  isRegisteredUser?: boolean;
};

interface CardProps {
  index: number;
  card: CourseBase;
  personaId?: number;
  variant?: "course" | "university" | "wishlist";
  onClick?: (id: number) => void;
  isRegisteredUser?: boolean;
}

//  card
const Card = ({
  card,
  variant,
  onClick,
  index,
  // personaId,
  isRegisteredUser,
}: CardProps) => {
  const router = useRouter();
  const { mutateAsync: toggleWishlistAsync, isPending } = useWishlistToggle();

  const [liked, setLiked] = useState(variant === "wishlist");
  const { i18n } = useTranslation();

  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data;

  const handleClick = () => {
    if (onClick) onClick?.(card.id);
  };
  const handleLikeToggle = (e: React.MouseEvent) => {
    if (!isRegisteredUser) {
      toast.error("Please log in to view your liked universities", {
        action: {
          label: "Login",
          onClick: () => router.navigate({ to: "/profile" }),
        },
      });
      return;
    }

    e.stopPropagation();

    setLiked((prev) => !prev);
    const wished = !liked;

    const promise = toggleWishlistAsync({
      // persona_id: String(personaId),
      course_id: String(card.id),
    });

    toast.promise(promise, {
      loading: "Updating wishlist...",
      success: () =>
        wished ? "Added to wishlist ❤️" : "Removed from wishlist 💔",
      error: "Failed to update wishlist ",
    });
  };
  const gradients = ["gradient-two", "gradient-three"];

  const gradientClass = gradients[index % 2];

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-linear-to-b shrink-0  shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-tr-[30px] rounded-b-[30px] overflow-hidden relative",
        gradientClass,
        "before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-full before:w-0.5 before:bg-white/10 before:backdrop-blur-md",
        "after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-full after:w-0.5 after:bg-white/10 after:backdrop-blur-md",
      )}
    >
      {/* div 1 */}

      <div className="w-full h-50 shrink-0 rounded-bl-[30px] overflow-hidden relative z-20 ">
        <img
          src={card?.image ?? "https://placehold.net/400x400.png"}
          alt={card?.name}
          className="w-full h-full object-cover rounded-tr-[30px]"
          onError={(e) => handleImgError(e)}
        />
        <div
          className="absolute inset-0 rounded-bl-[30px] pointer-events-none
    shadow-[inset_0_-1px_0_rgba(255,255,255,0.25)]"
        />

        {/* <GradientAnimatedButton
          buttonText={"95% Match "}
          className="w-auto absolute bottom-4 left-4 z-10"
          textClassName="text-[12px] px-2 "
          textGradient="linear-gradient(103.25deg, #757404 33.14%, #1483BF 111.12%)"
        /> */}

        <GlassSvgBtn
          onClick={handleLikeToggle}
          disabled={isPending}
          className="absolute z-10 top-4 right-4"
        >
          {liked || variant === "wishlist" ? (
            <RedLikeIconSVG />
          ) : (
            <LikeIconSvg />
          )}
        </GlassSvgBtn>

        <div className="absolute bottom-3 right-4 z-10 flex items-center gap-2 ">
          <img src={StarImg} alt="star image" />
          <span className="span-regular font-medium">{card?.rating}</span>
        </div>
      </div>

      {/* div 2 */}
      <div
        className={`
          flex flex-col gap-1.75
          px-4 pt-4 pb-5
         rounded-b-[22px] 
        `}
      >
        {variant !== "university" && (
          <p className="text-[#FFFFFF99] font-montserrat text-[12px] tracking-wide m-0 line-clamp-1">
            {card?.duration}
          </p>
        )}
        {variant !== "university" && (
          <h3
            className={`text-[16px] text-secondary font-unbounded leading-[1.2] line-clamp-2 whitespace-pre-line h-[2.4em] m-0 overflow-hidden ${card?.duration}`}
          >
            {card?.name}
          </h3>
        )}

        <p className="text-white text-[16px] font-montserrat m-0 line-clamp-1">
          {card?.university_name}
        </p>
        <div className="flex ml-1 mt-1.5 items-center">
          <img
            src={locationIcon}
            alt="location"
            className="inline w-[9.33px] h-[13.33px] mr-2 "
          />
          <p className="text-white text-[12px] font-montserrat line-clamp-1 m-0">
            {card?.university_location}
          </p>
        </div>
        <p className="text-[#FFFFFF] text-[12px] font-nontserrat line-clamp-1">
          {card?.fees === "0" ? (
            <span className=" font-montserrat  font-semibold text-[18px] text-[#FFFFFF]">
              {" "}
              Free
            </span>
          ) : (
            <>
              <span className=" font-montserrat  font-semibold text-[18px] text-[#FFFFFF]">
                {"₹"}
                {Number(card?.fees).toLocaleString("en-IN")}{" "}
              </span>
              {pageContent?.screen.bestFitCard.fees}
            </>
          )}
        </p>

        <p className="text-[#FFFFFF] text-[14px] font-montserrat m-0 line-clamp-2">
          {card?.short_desc}
        </p>

        <div className="mt-5 ml-2">
          <CTAButton
            text={pageContent?.degree.universityCard.button}
            glassEffect
            onClick={handleClick}
            icon={<RightArrowSVG />}
            className="font-montserrat rounded-[100px] bg-[#F0F0F04D] flex-row-reverse "
          />
        </div>
      </div>
    </div>
  );
};

//  Main component
const BestFitCard = ({
  heading,
  buttons = true,
  cardsData = [],
  variant,
  personaId,
  onCardClick,
  isRegisteredUser,
}: Props) => {
  return (
    <div className="relative">
      <>
        <div className="flex justify-between items-center mb-6">
          <div>
            {heading && <h2 className="text-[#FFFFFF] h3 ">{heading}</h2>}
          </div>

          {buttons && (
            <div className="hidden gap-4 md:flex">
              <BackButton className="bestfit-prev z-10 [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:pointer-events-none" />
              <BackButton className="bestfit-next rotate-180  z-10  [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:pointer-events-none" />
            </div>
          )}
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
          320: { slidesPerView: 1.2 },
          375: { slidesPerView: 1.3 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {cardsData.map((card, index) => (
          <SwiperSlide key={index}>
            <Card
              card={card}
              index={index}
              variant={variant}
              onClick={() => onCardClick?.(card.id)}
              personaId={personaId}
              isRegisteredUser={isRegisteredUser}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/*<div className="flex gap-8 overflow-x-auto scrollbar-hide">*/}
      {/*  {cardsData.map((card, index) => (*/}
      {/*    <Card*/}
      {/*      key={card.id}*/}
      {/*      card={{ ...card, index }}*/}
      {/*      variant={variant}*/}
      {/*      onClick={() => onCardClick?.(card.id)}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}
    </div>
  );
};

export default BestFitCard;
