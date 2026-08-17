import BackButton from "@/components/common/BackButton";
import Header from "@/components/header/Header";
import { Container } from "@/components/layout/Container";
import { Vstack } from "@/components/layout/Vstack";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import ProfileButton from "@/components/common/ProfileButton";
import TextNextStep from "@/components/common/TextNextStep";
import StrategistCard from "@/components/custom/resultScreen/StrategistCard";

import { motion } from "motion/react";
import { useState } from "react";
import { useInsights } from "@/queries/insight.query";
import { useSwipeStore } from "@/store/swipeStore";
import ShareButton from "@/components/common/ShareButton.tsx";
import ImageShareDrawer from "@/components/custom/insight/ImageShareDrawer.tsx";

import { useEffect } from "react";
import ErrorState from "@/components/common/ErrorState";
import { getAppLanguage } from "@/lib/getAppLanguage";
import { queryClient } from "@/lib/queryClient.ts";
import { getProfile } from "@/api/services/get-profile.ts";
import { fetchInsights } from "@/api/services/insightService.ts";
import { useResults } from "@/queries/result.query.ts";
import { getGameStatusData } from "@/queries/get-game-status-query.ts";
import PeopleLikeYouCarousel from "@/components/custom/insight/PeopleLikeYouCarousel.tsx";
import type { InsightResponse } from "@/types/result.ts";
import {getPageContent} from "@/api/services/get-page-content.ts";

export const Route = createFileRoute(
  "/(authenticated-routes)/_authenticated/insight",
)({
  beforeLoad: async () => {
    const { sessionId } = useSwipeStore.getState();

    if (
      !sessionId ||
      sessionId === "" ||
      sessionId === null ||
      sessionId === undefined
    ) {
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

    if (sessionId !== "") {
      await queryClient.ensureQueryData({
        queryKey: ["session", sessionId, getAppLanguage()],
        queryFn: () =>
          fetchInsights({ session_id: sessionId, lang: getAppLanguage() }),
      });
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
  loader: async () => {
    try {
      const { data: gameState } = await queryClient.fetchQuery({
        queryKey: ["game-state"],
        queryFn: getGameStatusData,
      });
      const { data: profile } = await queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getProfile,
      });
      return { profile, gameState };
    } catch {
      return { profile: null };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { profile, gameState } = Route.useLoaderData();

  const router = useRouter();
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const { sessionId } = useSwipeStore();
  const { data, error, refetch } = useInsights({
    session_id: sessionId,
    lang: getAppLanguage(),
  });

  const insightData = data?.data;

  const isGameCompleted =
    gameState?.is_mcq_done &&
    gameState?.is_round_two_complete &&
    gameState?.is_round_one_complete;

  const isRegisteredUser = profile?.user?.is_guest !== 1;
  const statusCode = error?.response?.status;

  const payload = { session_id: sessionId, lang: getAppLanguage() };

  const { data: resultData } = useResults(payload);

  const results = resultData?.data || null;

  const handleBackClick = () => {
    router.history.back();
  };

  const handleShareClick = () => {
    setIsSharePopupOpen(true);
  };

  useEffect(() => {
    if (!isGameCompleted) {
      router.navigate({ to: "/gameplay" });
    }
  }, [isGameCompleted, router]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isSharePopupOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isSharePopupOpen]);

  if (error) {
    return <ErrorState onRetry={refetch} statusCode={statusCode} />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.8, 0, 0.6, 1] }}
    >
      <Header
        left={<BackButton onClick={handleBackClick} />}
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
        <Container>
          <Vstack className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center ">
              <StrategistCard persona={insightData?.persona} />

              <TextNextStep
                className="place-items-end hidden max-w-sm ml-auto lg:block"
                onShareClick={handleShareClick}
                variant="insight"
                isRegisteredUser={isRegisteredUser}
                isSaved={results?.is_saved}
              />
            </div>

            <div>
              {/* The Inner Content (Transparent Background) */}

              <div className="">
                <PeopleLikeYouCarousel data={data as InsightResponse} />
              </div>
            </div>

            {/* Ad slot (300x250) */}
            {/*<div className="w-80 lg:w-75  h-12.5 lg:h-60 p-4 mx-auto  bg-[#78787866] flex items-center justify-center">*/}
            {/*  <span className="text-gray-500">Ad Space 300x250</span>*/}
            {/*</div>*/}

            <TextNextStep
              className="lg:hidden flex justify-center max-w-2xl m-auto"
              onShareClick={handleShareClick}
              variant="insight"
              isRegisteredUser={isRegisteredUser}
              isSaved={results?.is_saved}
            />
          </Vstack>
        </Container>
      </motion.div>

      <ImageShareDrawer
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
        data={insightData}
      />
    </motion.section>
  );
}
