import TextNextStep from "@/components/common/TextNextStep";
import BestFitCard from "@/components/custom/resultScreen/BestFitCard";
import Header from "@/components/header/Header";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";

// import { courseData } from "@/data/courseData";
import logo from "@/assets/splash/logo.png";
import ShareButton from "@/components/common/ShareButton";
import ProfileButton from "@/components/common/ProfileButton";
import { Container } from "@/components/layout/Container";
import { Vstack } from "@/components/layout/Vstack";
import StrategistCard from "@/components/custom/resultScreen/StrategistCard";
import {useCallback, useEffect, useMemo, useState} from "react";
import ResultOverlayScreen from "@/components/custom/resultScreen/ResultOverlayScreen";
import { motion, AnimatePresence } from "motion/react";
// import { useResults } from "@/queries/result.query";
import { useSwipeStore } from "@/store/swipeStore";
// import { useResults } from "@/queries/result.query";
import { useTranslation } from "react-i18next";
import { getAppLanguage } from "@/lib/getAppLanguage";
import { useGetProfileQuery } from "@/queries/get-profile-query";
import { queryClient } from "@/lib/queryClient.ts";
import { getProfile } from "@/api/services/get-profile.ts";
import ImageShareDrawer from "@/components/custom/insight/ImageShareDrawer.tsx";
import { useInsights } from "@/queries/insight.query.ts";
import {useCourseDetails, useResults} from "@/queries/result.query.ts";
import Softbadge from "@/components/common/SoftBadge";
import {getGameStatusData} from "@/queries/get-game-status-query.ts";
import ResultOverlayNextScreen from "@/components/custom/resultScreen/ResultOverlayNextScreen.tsx";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {useQuery} from "@tanstack/react-query";
// import { useCheckGame } from "@/queries/profile.query";

export const Route = createFileRoute(
  "/(authenticated-routes)/_authenticated/result-unlock",
)({
  beforeLoad: async () => {
    const { sessionId } = useSwipeStore.getState();

    if (!sessionId || sessionId === "" || sessionId === null || sessionId === undefined) {
      throw redirect({ to: "/gameplay" });
    }

    const { data, status, errors } = await queryClient.fetchQuery({
      queryKey: ["game-state"],
      queryFn: getGameStatusData,
    });

    if (status >= 400 || !data || errors) {
      throw redirect({ to: "/gameplay" });
    }

    if (data.is_round_two_complete && !data.is_mcq_done) {
      throw redirect({ to: "/step-three" });
    }

    if (
      data.is_round_one_complete &&
      !data.is_round_two_complete &&
      !data.is_mcq_done
    ) {
      throw redirect({ to: "/step-two" });
    }

    await queryClient.ensureQueryData({
      queryKey: ["result_page", getAppLanguage()],
      queryFn: () => getPageContent("result_page", getAppLanguage()),
    })

    await queryClient.ensureQueryData({
      queryKey: ["profile"],
      queryFn: getProfile,
    });


  },
  component: RouteComponent,
});

function RouteComponent() {
  // const router = useRouter();

  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedNextCourseId, setSelectedNextCourseId] = useState<
    number | null
  >(null);

  const { sessionId } = useSwipeStore();
  const { i18n } = useTranslation();
  const payload = useMemo(
    () => ({
      session_id: sessionId,
      lang: getAppLanguage(),
    }),
    [sessionId],
  );
  
  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data;

  const { data } = useResults(payload);

  const { data: insights } = useInsights({
    session_id: String(payload.session_id),
    lang: payload.lang,
  });

  const { data: courseData, isFetching: isCourseFetching } = useCourseDetails({
    course_id: String(selectedCourseId),
    lang: getAppLanguage(),
    session_id: sessionId,
  });

  const { data: profile } = useGetProfileQuery();

  // const clearSession = useSwipeStore((state) => state.clearSession);
  // const { mutate: CanCheckGame } = useCheckGame();
  
  //   useEffect(() => {
  //    console.log("is usefeffc trun")
  //   CanCheckGame(undefined, {
  //     onError: (error: any) => {
  //       console.log("error",error.response.status)
  //       // check if status code is 404
  //       if (error?.response?.status === 404) {
  //         clearSession();
  //         redirect({ to: "/gameplay" });
  //         // localStorage.removeItem("sessionId")
  //         // or localStorage.removeItem("sessionId");
  //       }
  //     },
  //   });
  // }, []);

  const isRegisteredUser = profile?.data?.user?.is_guest !== 1;

  const resultData = data?.data ?? null;

  const personaId = resultData?.persona?.id;

  const handleCardClick = useCallback((id: number) => {
    setSelectedCourseId(id);
  }, []);
  const handleNextCardClick = useCallback((id: number) => {
    setSelectedNextCourseId(id);
  }, []);

  const handleOverlayClose = () => {
    setSelectedCourseId(null);
  };
  const handleOverlayNextClose = () => {
    setSelectedNextCourseId(null);
  };

  const handleShareClick = () => {
    setIsSharePopupOpen(true);
  };



  useEffect(() => {
    if (selectedCourseId !== null) {
      // lock scroll
      document.body.style.overflow = "hidden";
    } else {
      // restore scroll
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [selectedCourseId]);

  const insightData = insights?.data;

  return (
    <div>
      <Header
        left={
          <Link to="/">
            <motion.img
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
              src={logo}
              alt="App logo"
              loading="lazy"
              className="w-27 h-10 lg:w-33.75 lg:h-12.5"
            />
          </Link>
        }
        right={
          <div className="flex gap-4">
            <ShareButton />
            <ProfileButton />
          </div>
        }
      />
      <motion.div
        initial={{ y: 600, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
      >
        <Container className="relative">
          <Vstack className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <StrategistCard showButton persona={resultData?.persona} />

              <TextNextStep
                onShareClick={() => handleShareClick()}
                className="place-items-end hidden max-w-sm ml-auto md:block"
                isRegisteredUser={isRegisteredUser}
                isSaved={resultData?.is_saved}
              />
            </div>

            <div>
              <h2 className="text-[#FFFFFF] h3 mb-6">
                {pageContent?.screen.industry.heading}
              </h2>
              <div className="flex justify-start gap-2 flex-wrap">
                {resultData?.persona?.industries?.map((item, index) => (
                  <Softbadge key={index} className="lg:text-[14px] mx-0">
                    {item}
                  </Softbadge>
                ))}
              </div>
            </div>

            <BestFitCard
              heading={pageContent?.screen.nextStep.heading}
              cardsData={resultData?.courses ?? []}
              onCardClick={handleCardClick}
              personaId={personaId}
              isRegisteredUser={isRegisteredUser}
              buttons={true}
            />

            <TextNextStep
              onShareClick={() => handleShareClick()}
              isRegisteredUser={isRegisteredUser}
              isSaved={resultData?.is_saved}
              className="md:hidden flex justify-center max-w-2xl m-auto"
            />
          </Vstack>
          <AnimatePresence>
            {selectedCourseId !== null && (
              <ResultOverlayScreen
                key={selectedCourseId}
                courseId={selectedCourseId}
                onClose={handleOverlayClose}
                isRegisteredUser={isRegisteredUser}
                handleClick={handleNextCardClick}
                data={courseData}
                isFetching={isCourseFetching}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedNextCourseId !== null && (
              <ResultOverlayNextScreen
                key={selectedNextCourseId}
                courseId={selectedNextCourseId}
                onClose={handleOverlayNextClose}
                data={courseData}
              />
            )}
          </AnimatePresence>
        </Container>
      </motion.div>
      <ImageShareDrawer
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
        data={insightData}
      />
    </div>
  );
}
