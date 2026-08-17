import AppLogo from "@/components/common/AppLogo";
import BackButton from "@/components/common/BackButton";
import GradientCard from "@/components/common/GradientCard";
import Header from "@/components/header/Header";
import { Container } from "@/components/layout/Container";
import { Vstack } from "@/components/layout/Vstack";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import startImg from "@/assets/home/start-swip.webp";
import QAAvatar from "@/assets/home/avatar.webp";
import course1 from "@/assets/home/course-1.webp";
import course2 from "@/assets/home/course-2.webp";
import line1 from "@/assets/home/Line 18.png";
import line2 from "@/assets/home/Line 21.png";
import line3 from "@/assets/home/Line 20.png";
import line4 from "@/assets/home/Line 19.png";
import swipeLeft from "@/assets/home/video/swipe-left.mp4";
import swipeRight from "@/assets/home/video/swipe-right.mp4";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton";
import brainImg from "@/assets/result/brain.png";
import ThumbDownSVG from "@/components/svgs/icons/ThumbDownSVG";
import GlassSvgBtn from "@/components/common/GlassSvgBtn";
import ThumbUpIconSVG from "@/components/svgs/icons/ThumbUpIconSVG";
import MultiLanguage from "@/components/common/MultiLanguage";
import { useTranslation } from "react-i18next";
import type { Swipe } from "@/types/howToPlay";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";
import { useQuery } from "@tanstack/react-query";
import { getPageContent } from "@/api/services/get-page-content.ts";
import { queryClient } from "@/lib/queryClient.ts";

export const Route = createFileRoute("/how-to-play")({
  beforeLoad: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["howtoplay_page", getAppLanguage()],
      queryFn: () => getPageContent("howtoplay_page", getAppLanguage()),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryKey: ["howtoplay_page", i18n.language],
    queryFn: () => getPageContent("howtoplay_page", getAppLanguage()),
  });

  const pageContent = data?.data;

  const assetMap = {
    "swipe-right": swipeRight,
    "swipe-left": swipeLeft,
  };

  

  const step4List = (pageContent?.winning?.list as string[]) || [];
  const swipesData = (pageContent?.swipes as Swipe[]) || [];

  return (
    <section className="px-5 lg:p-0">
      <Header
        left={
          <>
            {/* Desktop version */}
            <div>
              <AppLogo />
            </div>

            {/* Mobile version */}
            {/* <div className="flex gap-4 items-center lg:hidden">
              <BackButton onClick={() => router.history.back()} />
              <h2 className="h2-md">{t("backTitle")}</h2>
            </div> */}
          </>
        }
        right={<MultiLanguage />}
      />
      <Container className=" max-w-107.5 lg:max-w-299 relative">
        <Vstack className="py-6 lg:py-20">
          <div className="gap-4 items-center relative lg:absolute lg:top-8 lg:left-0 flex">
            <BackButton onClick={() => router.history.back()} />
            <h2 className="h2-md">{pageContent?.backTitle}</h2>
          </div>
          <h2 className="h2-md text-center mb-5">{pageContent?.title}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 ">
            {/* step-1 */}

            <GradientCard
              innerClass="p-4 lg:p-2 flex gap-6 items-start"
              className="order-2 md:order-1 relative z-20"
            >
              <img src={startImg} alt="start swip" className="w-31.5" />
              <div className="py-4">
                <p className="p-light">{pageContent?.start.step}</p>
                <h3 className="h3-md">{pageContent?.start.title}</h3>
                <p className="p-light">{pageContent?.start.desc}</p>
              </div>
            </GradientCard>

            {/* log0 card */}
            <div className="ml-0 lg:ml-8 order-1 md:order-2">
              <img
                src={QAAvatar}
                alt="qa avatar"
                className="h-46.25 w-auto mx-auto"
              />
              <div className="hidden lg:block relative after:content-[''] after:absolute after:w-15 after:h-px after:bg-red-200 after:left-full after:top-1/2 after:-translate-y-1/2 after:block after:bg-linear-to-l after:from-[#316152] after:to-secondary z-30">
                <Link to="/gameplay">
                  <GradientAnimatedButton
                    buttonText={pageContent?.button}
                    className="max-w-82 w-full"
                    textClassName="py-3"
                  />
                </Link>
              </div>
            </div>

            {/* step- 4 */}
            <div className="relative z-50 lg:row-start-1 lg:col-start-3 lg:row-span-2 lg:col-span-1 order-4 md:order-3">
              <div className="block lg:hidden absolute left-1/2 bottom-full h-10 w-px bg-linear-to-b from-[#0D1F20] to-[#DEDB0066]" />
              <GradientCard innerClass="p-5 lg:p-5">
                <div className="space-y-2">
                  <p className="p-light">{pageContent?.winning.step}</p>
                  <h3 className="h3-md">{pageContent?.winning.title}</h3>
                  <ul className="custom-list list-outside pl-5 space-y-1">
                    {step4List.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mx-5 flex justify-center relative pb-12 mt-6">
                  <img
                    src={course2}
                    alt="course 1"
                    className="max-w-29.5 relative z-2"
                  />
                  <img
                    src={course1}
                    alt="course 2"
                    className="absolute z-1 max-w-27.5 w-full rotate-6 right-5 top-3"
                  />
                  <img
                    src={course1}
                    alt="course 3"
                    className="absolute z-1 max-w-27.5 w-full -rotate-6 left-5 top-3"
                  />

                  <div className="flex flex-col gap-3 justify-center gradient-strategist absolute bottom-0 z-40 backdrop-blur-[14.4px] bg-black/20 px-5 py-3">
                    <div className="flex justify-center items-center gap-4">
                      <img
                        src={brainImg}
                        alt="strategirst-icon"
                        className="max-w-15 w-full"
                      />

                      <h2 className="p-md text-[13px] leading-5 font-normal">
                        {pageContent?.winning.strategyCard.primaryTitle}{" "}
                        <span className="block text-secondary text-[15px]  leading-6 font-unbounded font-normal">
                          {pageContent?.winning.strategyCard.SecondaryTitle}
                        </span>
                      </h2>
                    </div>
                    <p className="p-md text-[12px] leading-4.5  text-center">
                      {pageContent?.winning.strategyCard.desc}
                    </p>
                  </div>
                </div>
              </GradientCard>
            </div>

            {/* step- 2 */}
            <div className="flex flex-col lg:flex-row lg:col-span-2 relative gap-10 lg:gap-12 order-3 md:order-4 z-10">
              {/* <div className="flex absolute top-0 left-1/2 -translate-x-1/2 z-50">
                <img src={line1} alt="line-1" />
                <img src={line2} alt="line-2" />
              </div> */}
              {swipesData.map((data, index) => {
                return (
                  <div key={data.id} className="relative flex-1 z-10">
                    {index % 2 === 0 && (
                      <>
                        <div className=" absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 -z-10 hidden lg:flex items-end">
                          <img src={line1} alt="line-1" />
                          <img
                            src={line2}
                            alt="line-2"
                            className=" -translate-x-px"
                          />
                        </div>
                        <img
                          src={line4}
                          alt="line-4"
                          className="absolute -z-10 left-1/2 -bottom-8  max-w-none w-auto hidden lg:block"
                        />
                      </>
                    )}
                    {index % 2 === 1 && (
                      <img
                        src={line3}
                        alt="line-3"
                        className="absolute -z-10 left-1/2 -bottom-8 max-w-none w-auto hidden lg:block"
                      />
                    )}
                    <GradientCard
                      innerClass={`p-4 lg:p-2 flex gap-2 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
                    >
                      <div className="flex-1 flex flex-col justify-between py-4 pl-0 lg:pl-4">
                        <div>
                          <p className="p-light">{data.step}</p>
                          <h3 className="h3-md">{data.title}</h3>
                          <p className="p-light">{data.desc}</p>
                        </div>

                        <div className="flex flex-col items-center justify-center w-fit">
                          <GlassSvgBtn className="shadow-[1px_1px_17.2px_1px_#FFFFFFCC]">
                            {data?.asset === "swipe-right" ? (
                              <ThumbUpIconSVG />
                            ) : (
                              <ThumbDownSVG />
                            )}
                          </GlassSvgBtn>

                          <h2 className="font-unbounded text-2xl leading-9 font-normal mt-2">
                            {" "}
                            {data.type}{" "}
                          </h2>
                        </div>
                      </div>

                      <div className="flex-1">
                        <video
                          src={assetMap[data.asset]}
                          autoPlay
                          loop
                          muted
                          preload="auto"
                          playsInline
                          className="w-full h-auto rounded-[14px]"
                        />
                      </div>
                    </GradientCard>

                    <div className="block lg:hidden absolute left-1/2 bottom-full h-10 w-px bg-linear-to-b from-[#0D1F20] to-[#DEDB0066]" />
                  </div>
                );
              })}
            </div>

            <div className="order-5 block lg:hidden relative ">
              <Link to="/gameplay">
                <GradientAnimatedButton
                  buttonText={pageContent?.button}
                  className=" w-full"
                  textClassName="py-3"
                />
              </Link>
            </div>
          </div>
        </Vstack>
      </Container>
    </section>
  );
}
