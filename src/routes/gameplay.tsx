import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { useEffect, useRef, useState } from "react";
import ActionButtons from "@/components/custom/game/ActionButtons";
import SwipeCard from "@/components/custom/game/SwipeCard";

import { motion, useMotionValue } from "motion/react";
import Header from "@/components/header/Header";
import { Vstack } from "@/components/layout/Vstack";
import Softbadge from "@/components/common/SoftBadge";
import SwipeSvgIcon from "@/components/custom/game/SwipeSvgIcon";
import gradientCircle from "@/assets/svg/gradient-circle.svg";
import CloseDrawer from "@/components/custom/game/CloseDrawer";
import ProgressBar from "@/components/custom/game/ProgressBar";

import { useSubmitSwipes, useSwipeCards } from "@/queries/swipe.query";
import type { SwipeCardData } from "@/types/swipe";
import AppLogo from "@/components/common/AppLogo";
import CloseButton from "@/components/custom/game/CloseButton";
import { useSwipeStore } from "@/store/swipeStore";
import ErrorState from "@/components/common/ErrorState";
import greenShadowImg from "@/assets/game/green-shadow.webp";
import redShadowImg from "@/assets/game/red-shadow.webp";
import { getProfile } from "@/api/services/get-profile.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { getAppLanguage } from "@/lib/getAppLanguage";
import { StepIntro } from "@/components/custom/game/StepIntro";
import { getGameStatusData } from "@/queries/get-game-status-query.ts";
import { useTranslation } from "react-i18next";
import { getDeviceInfo } from "@/lib/get-device-info.ts";
import { useQuery } from "@tanstack/react-query";
import { getPageContent } from "@/api/services/get-page-content.ts";

export const Route = createFileRoute("/gameplay")({
  beforeLoad: async () => {
    const { sessionId, setSessionId } = useSwipeStore.getState();

    const res = await queryClient.fetchQuery({
      queryKey: ["game-state"],
      queryFn: getGameStatusData,
    });

    const { data, status, errors } = res;

    if (
      !sessionId ||
      sessionId === "" ||
      sessionId === null ||
      sessionId === undefined
    ) {
      return;
    }

    if (status >= 400 || !data || errors) {
      setSessionId("");
      return;
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
      queryKey: ["gameplay_page", getAppLanguage()],
      queryFn: () => getPageContent("gameplay_page", getAppLanguage()),
    });
  },
  loader: async () => {
    const deviceInfo = await getDeviceInfo();
    try {
      const { data: profile } = await queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getProfile,
      });
      return { profile, deviceInfo };
    } catch {
      return { profile: null, deviceInfo };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { deviceInfo } = Route.useLoaderData();
  const navigate = useNavigate();

  // prevent duplicate submit
  const hasSubmittedRef = useRef(false);

  const { data, isLoading, isError, refetch } = useSwipeCards({
    lang: getAppLanguage(),
    device: deviceInfo?.deviceType,
    browser: deviceInfo?.browser,
    os: deviceInfo?.os,
    ip: deviceInfo?.ipAddress,
  });

  const setSessionId = useSwipeStore((s) => s.setSessionId);
  const swipes = useSwipeStore((state) => state.swipes);

  const [isReady, setIsReady] = useState(false);
  const { mutate: submitSwipes } = useSubmitSwipes();
  const { i18n } = useTranslation("gameplay");

  const [cards, setCards] = useState<SwipeCardData[] | null>(null);
  const cardData: SwipeCardData[] = data?.data?.cards ?? [];

  const [trigger, setTrigger] = useState<"left" | "right" | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const totalCards = cardData.length;
  const topCard = cards?.[0];
  const isFinished = cards !== null && cards.length === 0;
  // swipeX represents the horizontal offset of the top card
  const swipeX = useMotionValue(-200);

  const removeTopCard = () => {
    setCards((prev) => (prev ? prev.slice(1) : prev));
    swipeX.set(0); // Reset position for the next card
  };

  const handleClose = () => {
    setDrawerOpen(true);
  };

  const { data: pageContent } = useQuery({
    queryKey: ["gameplay_page", i18n.language],
    queryFn: () => getPageContent("gameplay_page", getAppLanguage()),
  });

  const pageContentData = pageContent?.data;

  useEffect(() => {
    if (!isFinished || isLoading) return;
    if (hasSubmittedRef.current) return;

    const swipes = useSwipeStore.getState().swipes;

    hasSubmittedRef.current = true;

    submitSwipes(
      {
        session_id: data?.data?.session_id,
        swipes,
      },
      {
        onSuccess: () => {
          setSessionId(data?.data?.session_id);
          navigate({ to: "/step-two" });
          useSwipeStore.getState().clearSwipes();
        },
        onError: (err) => {
          console.error("Submit failed:", err);
          hasSubmittedRef.current = false; // allow retry
        },
      },
    );
  }, [isFinished, isLoading]);

  useEffect(() => {
    if (data?.data?.cards) {
      setCards(data.data.cards);
    }
  }, [data?.data?.cards]);

  useEffect(() => {
    // Reset the shared motion value whenever we enter the route
    swipeX.set(0);
  }, []);

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-black ">
      <Header
        left={<AppLogo variant="animated" />}
        right={
          <>
            <div className="flex gap-4">
              <motion.div
                initial={{ x: 150, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="will-change-transform"
              >
                {/* <MultiLanguage /> */}
              </motion.div>

              {!isFinished && <CloseButton onClick={handleClose} />}
            </div>
          </>
        }
      />
      <Container className="lg:max-w-175 overflow-hidden h-[calc(100vh-70px)]">
        <Vstack className="relative h-full flex items-center justify-center">
          <img
            src={redShadowImg}
            alt="green shadow"
            className="absolute -left-1/2 md:left-0 -top-8"
          />
          <img
            src={greenShadowImg}
            alt="red shadow"
            className="absolute -right-1/2 md:right-0 -top-8"
          />
          {/* <RedShadowElipse className="left-0 -top-8"  />
          <GreenShadowElipse className="right-0 -top-8" /> */}
          <CloseDrawer
            isOpen={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
            }}
          />
          {!isReady && (
            <StepIntro
              label={pageContentData?.splash?.label}
              title={pageContentData?.splash?.title}
            />
          )}

          {/* message  */}
          {/* {isFinished && (
            <h2 className="text-primary-70 h2 absolute top-1/2 left-1/2 -translate-1/2 text-center ">
              This is where it gets exciting…
            </h2>
          )} */}
          {isReady && (
            <div className="flex flex-col justify-center items-center relative">
              {/* grdient circle */}

              <motion.img
                initial={{ scale: 4.7 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                src={gradientCircle}
                className="will-change-transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                alt="gradient-cicle"
              />

              {/* game section */}

              <div className="flex flex-col items-center space-y-2 gap-4 w-full">
                <div className="relative  mt-2 w-60 lg:w-[min(30vw,35vh)] aspect-square">
                  {cards?.map((card, index) => (
                    <SwipeCard
                      key={card.id}
                      card={card}
                      index={index}
                      // Only the top card (index 0) gets the shared X value
                      swipeX={index === 0 ? swipeX : undefined}
                      onSwipe={removeTopCard}
                      triggerSwipe={index === 0 ? trigger : null}
                      clearTrigger={() => setTrigger(null)}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                  className="will-change-transform"
                >
                  {!isFinished && (
                    <Softbadge className="text-[20px] lg:text-[16px] w-full lg:w-[80%]">
                      {topCard?.questions ?? "What matters to you?"}
                    </Softbadge>
                  )}
                </motion.div>

                {/* Swipe Svg Icon */}

                {!isFinished && (
                  <>
                    <SwipeSvgIcon />
                    <ActionButtons
                      swipeX={swipeX}
                      triggerSwipe={trigger}
                      onLike={() => setTrigger("right")}
                      onDislike={() => setTrigger("left")}
                    />
                  </>
                )}

                <ProgressBar
                  label={pageContentData?.splash?.label}
                  total={totalCards}
                  current={swipes.length}
                />
              </div>
            </div>
          )}
        </Vstack>
      </Container>
    </section>
  );
}
