import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { Vstack } from "@/components/layout/Vstack";
import { motion } from "motion/react";
import QAAvatar from "@/assets/home/QA-avatar.webp";
// import prizeInfo from "@/assets/home/rewardImage.webp";
import curvedImage from "@/assets/home/s-type-frame.png";
import curvedImaged from "@/assets/home/s-type-frame-md.png";
import StartSwipeAnimation from "@/components/custom/dashboard/StartSwipeAnimation";
import Header from "@/components/header/Header";
import AppLogo from "@/components/common/AppLogo";
import GlassSvgBtn from "@/components/common/GlassSvgBtn";
import QuestionIconSVG from "@/components/svgs/icons/QuestionIconSVG";
import ProfileButton from "@/components/common/ProfileButton";
import ShareSVG from "@/components/svgs/icons/ShareSVG";
import EducationLogo from "@/components/custom/home/EducationLogo";
import userIcon from "@/assets/dashboard/user-one.png";
import MultiLanguage from "@/components/common/MultiLanguage";
import { useCheckGame } from "@/queries/profile.query";
import { useEffect } from "react";
import { useSwipeStore } from "@/store/swipeStore";
import { useQuery } from "@tanstack/react-query";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";
import { getPageContent } from "@/api/services/get-page-content.ts";
import {useTranslation} from "react-i18next";
import {queryClient} from "@/lib/queryClient.ts";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["dashboard", getAppLanguage()],
      queryFn: () => getPageContent("dashboard_page", getAppLanguage()),
    })
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { i18n } = useTranslation();

  const { mutate: CanCheckGame } = useCheckGame();

  const clearSession = useSwipeStore((state) => state.clearSession);

  const { data } = useQuery({
    queryKey: ["dashboard", i18n.language],
    queryFn: () => getPageContent("dashboard_page", getAppLanguage()),
  });

  const dashboardContent = data?.data?.cards;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Welcome to Future Swipe!",
        url: import.meta.env.VITE_BASE_URL as string,
      });
    } else {
      window.parent.postMessage(
        {
          type: "SHARE",
          data: {
            title: "My Title",
            text: "Check this out",
            url: import.meta.env.VITE_BASE_URL as string,
          },
        },
        "*",
      );
    }
  };

  useEffect(() => {
    CanCheckGame(undefined, {
      onSuccess: (response: any) => {
        // API returns 200 but game not found in response
        if (
          response?.status === 404 ||
          response?.data?.status === 404 ||
          !response?.data
        ) {
          clearSession();
        }
      },
    });
  }, []);

  return (
    <>
      <section className="bg-black">
        <Header
          className="flex"
          left={<AppLogo className="w-full h-full" />}
          right={<MultiLanguage />}
        />
        <Container>
          <Vstack className="flex flex-col justify-center items-center gap-8">
            {/* image  */}
            {/* <Link to="/">
            <motion.div
              initial={{ y: -150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex justify-center items-center lg:hidden"
            >
              <img src={Centeredlogo} alt="center-logo" />
            </motion.div></Link> */}

            {/* details */}

            <motion.div
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="flex flex-col ">
                  <StartSwipeAnimation title={dashboardContent?.start?.title} />

                  {/*-------------- profile-------------- */}
                  <div
                    onClick={() => navigate({ to: "/profile" })}
                    className="md:flex-1 mt-4 md:flex md:flex-row-reverse justify-between cursor-pointer w-full bg-[linear-gradient(180deg,rgba(138,56,245,0.11)_0%,rgba(255,255,255,0.11)_100%)] rounded-t-[30px] rounded-br-[30px]"
                  >
                    <div className="relative flex items-end justify-end lg:pr-10">
                      <img
                        className="object-contain object-bottom size-full max-w-32 lg:max-w-40"
                        src={userIcon}
                        alt="prize"
                      />
                    </div>
                    <div className="relative pt-0 md:pt-5 p-5">
                      <Link to="/profile">
                        <ProfileButton className="absolute md:relative -top-12 md:top-0" />
                      </Link>
                      {/* <SvgIcon
                      variant="profile"
                      className="absolute lg:relative -top-12 lg:top-0"
                    /> */}
                      <h2 className="h2-light pt-2">
                        {dashboardContent?.profile?.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div>
                  {/* --------- how to play--------------- */}

                  <div
                    onClick={() => navigate({ to: "/how-to-play" })}
                    className="bg-[linear-gradient(180deg,#DEDB00_0%,#050712_100%)] relative cursor-pointer rounded-tr-[30px]  rounded-b-[30px] overflow-hidden  z-1"
                  >
                    {/* Top image area */}
                    <div className="relative px-4 border-l-[6px] border-black ">
                      <div className="flex justify-center items-center mx-auto">
                        <img
                          className="object-contain object-center"
                          src={QAAvatar}
                          alt="Illustration"
                        />
                      </div>
                      <Link to="/how-to-play">
                        <GlassSvgBtn className="absolute bottom-6">
                          <QuestionIconSVG />
                        </GlassSvgBtn>
                      </Link>
                    </div>

                    {/* Curved separator SVG */}

                    {/* Text area */}

                    <div className="p-5 rounded-tr-[30px] relative rounded-b-[30px] ">
                      <img
                        src={curvedImage}
                        alt=""
                        className="w-full h-[120%] absolute  left-0 bottom-0 -z-1 hidden md:block"
                      />
                      <img
                        src={curvedImaged}
                        alt=""
                        className=" max-w-[103%] w-[103%] h-[117%] absolute  left-0 bottom-0 -z-1 block md:hidden"
                      />

                      <h2 className="h2-light">{dashboardContent?.play?.title}</h2>
                      <p className="p-medium-2 mt-2 text-white/60">
                        {dashboardContent?.play?.desc}
                      </p>
                    </div>
                  </div>
                  {/* --------- share --------------- */}

                  <div
                    onClick={() => handleShare()}
                    className="bg-[linear-gradient(180deg,#002C44_0%,#006EAA_100%)] p-5 rounded-t-[30px] rounded-bl-[30px] mt-4 cursor-pointer"
                  >
                    {/* <SvgIcon variant="share" /> */}
                    <GlassSvgBtn>
                      <ShareSVG />
                    </GlassSvgBtn>
                    <h2 className="h2-light pt-2 lg:max-w-[80%]">
                      {dashboardContent?.share?.title}
                    </h2>
                  </div>
                </div>
              </div>
              <EducationLogo />
            </motion.div>

            {/*<ShareDrawer open={open} onOpenChange={setOpen} />*/}
          </Vstack>
        </Container>
      </section>
    </>
  );
}
