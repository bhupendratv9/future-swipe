import { createFileRoute, useRouter } from "@tanstack/react-router";
import Header from "@/components/header/Header.tsx";
import BackButton from "@/components/common/BackButton.tsx";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import { AnimatePresence, motion } from "motion/react";
import { useWishlists } from "@/queries/profile.query";
import { useTranslation } from "react-i18next";
import BestFitCard from "@/components/custom/resultScreen/BestFitCard";
import ResultOverlayScreen from "@/components/custom/resultScreen/ResultOverlayScreen";
import { useCallback, useEffect, useState } from "react";
import ErrorState from "@/components/common/ErrorState";
import { queryClient } from "@/lib/queryClient.ts";
import { getProfile } from "@/api/services/get-profile.ts";
import { getAppLanguage } from "@/lib/getAppLanguage";
import { useCourseDetails } from "@/queries/result.query";
import ResultOverlayNextScreen from "@/components/custom/resultScreen/ResultOverlayNextScreen";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";

export const Route = createFileRoute(
  "/(authenticated-routes)/_authenticated/profile/_with-login/liked-universities",
)({
  beforeLoad: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["profile_page", getAppLanguage()],
      queryFn: () => getPageContent("profile_page", getAppLanguage()),
    });
  },
  component: RouteComponent,
  loader: async () => {
    try {
      const { data: profile } = await queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getProfile,
      });
      return { profile };
    } catch {
      return { profile: null };
    }
  },
});

function RouteComponent() {
  const { profile } = Route.useLoaderData();
  const router = useRouter();
  const { i18n } = useTranslation();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedNextCourseId, setSelectedNextCourseId] = useState<
    number | null
  >(null);


  const { data: profilePageData } = useQuery({
    queryKey: ["profile_page", i18n.language],
    queryFn: () => getPageContent("profile_page", getAppLanguage()),
  });

  const likedPageData = profilePageData?.data?.menu?.universities;

  const payload = {
    lang: i18n.language ?? "en",
    wishlist_id: "",
  };
  const { data, error, refetch } = useWishlists(payload);

  const { data: courseData, isFetching: isCourseFetching } = useCourseDetails({
    course_id: String(selectedCourseId),
    lang: getAppLanguage(),
  });
  const wishlist = data?.data?.course ?? [];
  const personaId = data?.data?.category?.id;
  const isNotFound = error?.response?.status === 404;
  const isServerError = error?.response?.status === 500;

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

  const handleBack = () => {
    router.navigate({
      to: "/profile",
      replace: true,
    });
  };

  const isRegisteredUser = profile?.data?.user?.is_guest !== 1;

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

  if (isServerError) {
    return <ErrorState onRetry={refetch} />;
  }


  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.8, 0, 0.6, 1] }}
    >
      <Header
        left={
          <div className="flex gap-3 items-center">
            <BackButton
              onClick={() => {
                handleBack();
              }}
            />
            <p className="h2">{likedPageData.like}</p>
          </div>
        }
      />
      <Vstack size="sm">
        <Container>
          {isNotFound ? (
            <h2 className="text-primary-70 h2 absolute top-1/2 left-1/2 -translate-1/2 text-center ">
              {likedPageData.empty}
            </h2>
          ) : (
            <motion.div
              initial={{ y: 600, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
              className="mx-auto flex flex-col gap-5 h-full min-h-[80vh] justify-between"
            >
              <BestFitCard
                isRegisteredUser={profile.user.is_guest !== 1}
                cardsData={wishlist}
                personaId={personaId}
                variant="wishlist"
                onCardClick={handleCardClick}
              />
            </motion.div>
          )}

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
      </Vstack>
    </motion.main>
  );
}
