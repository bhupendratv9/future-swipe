import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import AppLogo from "@/components/common/AppLogo.tsx";
import { motion } from "motion/react";
import CloseButton from "@/components/custom/game/CloseButton.tsx";
import Header from "@/components/header/Header.tsx";
import { useEffect, useState } from "react";
import CloseDrawer from "@/components/custom/game/CloseDrawer.tsx";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import redShadowImg from "@/assets/game/red-shadow.webp";
import greenShadowImg from "@/assets/game/green-shadow.webp";
import gradientCircle from "@/assets/svg/gradient-circle.svg";

import financialImage from "@/assets/game/financial.jpg";
import { Radio, RadioGroup } from "@base-ui/react";
import { cn } from "@/lib/utils.ts";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useGetMcqQuery } from "@/queries/get-mcq-query.ts";
import { useSwipeStore } from "@/store/swipeStore.ts";
import { useSubmitMcqMutation } from "@/queries/mutations/submit-mcq-mutation.ts";
import { toast } from "sonner";
import { StepIntro } from "@/components/custom/game/StepIntro";
import ProgressBar from "@/components/custom/game/ProgressBar";
import { queryClient } from "@/lib/queryClient.ts";
import { getGameStatusData } from "@/queries/get-game-status-query.ts";
import { useTranslation } from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

export const Route = createFileRoute("/step-three")({
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

    if (data.is_mcq_done) {
      throw redirect({ to: "/dashboard" });
    }

    if (data.is_round_one_complete && !data.is_round_two_complete) {
      throw redirect({ to: "/step-two" });
    }

    await queryClient.ensureQueryData({
      queryKey: ["quiz_page", getAppLanguage()],
      queryFn: () => getPageContent("quiz_page", getAppLanguage()),
    })
  },
  component: RouteComponent,
});

const quizSchema = z.object({
  answer: z.string().min(1, "Please select an option"),
});

function RouteComponent() {
  const router = useRouter();

  const { sessionId } = useSwipeStore();
  const [step, setStep] = useState(0);
  const { isLoading, data } = useGetMcqQuery(sessionId);
  const questions = data?.data?.questions ?? [];

  const mcqMutation = useSubmitMcqMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentQuestion = questions[currentIndex];

  const { i18n } = useTranslation("quiz");

  const { data:pageContent } = useQuery({
    queryKey: ["quiz_page", i18n.language],
    queryFn: () => getPageContent("quiz_page", getAppLanguage()),
  });

  const pageContentData = pageContent?.data;

  useEffect(() => {
    if (sessionId === "") {
      router.navigate({ to: "/gameplay" });
    }
  }, [sessionId, router]);

  const form = useForm({
    defaultValues: {
      answer: "",
    },
    validators: {
      onChange: quizSchema,
    },
    onSubmit: async ({ value }) => {
      // Store the answer

      const result = {
        key: currentQuestion.key,
        value: value.answer,
      };
      const updatedResults = [...quizResults, result];
      setQuizResults(updatedResults);

      const formData = new FormData();

      formData.append("session_id", sessionId);
      formData.append("answers", JSON.stringify(updatedResults));

      const mcqData = { session_id: sessionId, answers: updatedResults };

      if (!isLastQuestion) {
        // Move to next question and reset field
        setCurrentIndex((prev) => prev + 1);
        form.reset();
      } else {
        mcqMutation.mutate(mcqData, {
          onSuccess: (res) => {
            router.navigate({ to: "/result-unlock" });
            toast.success(res.data.message);
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Error submitting quiz",
            );
          },
        });
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setDrawerOpen(true);
  };

  if (isLoading)
    return (
      <main className="bg-black min-h-screen">
        <Header left={<AppLogo variant="animated" />} />
        <Container>
          <Vstack className="h-[80vh] flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-white/20 border-t-white/50 rounded-full animate-spin"></div>
          </Vstack>
        </Container>
      </main>
    );
  return (
    <main className="bg-black">
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

              {<CloseButton onClick={handleClose} />}
            </div>
          </>
        }
      />

      <Container className="lg:max-w-175 h-[calc(100vh-70px)]">
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

          {!isReady && (
            <StepIntro label={pageContentData?.splash.label} title={pageContentData?.splash.title} />
          )}

          {isReady && (
            <div className="flex flex-col justify-center items-center relative max-w-93 mx-auto h-full">
              <motion.img
                initial={{ scale: 4.7 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                src={gradientCircle}
                className="will-change-transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                alt="gradient-cicle"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-5 z-10"
              >
                <div className="bg-white/10 rounded-[30px] p-1.5 space-y-1.5">
                  <div className="rounded-[30px] overflow-hidden max-h-50">
                    <img
                      src={financialImage}
                      alt=""
                      className="object-center object-cover"
                    />
                  </div>
                  <div className="rounded-full py-2.5 px-5 flex items-center justify-center bg-white/20">
                    <p>{currentQuestion.question}</p>
                  </div>
                </div>

                <div>
                  <div className="bg-white text-black w-max rounded-t-[30px] px-5 py-2">
                    {pageContentData?.splash.select}
                  </div>
                  <div className="border border-white rounded-tr-[30px] rounded-bl-[30px] p-2.5 divide-y divide-white/20">
                    <form.Field name="answer">
                      {(field) => {
                        return (
                          <RadioGroup
                            value={field.state.value}
                            onValueChange={(e) => {
                              field.handleChange(e);
                              setTimeout(() => form.handleSubmit(), 0);
                              setStep((prevStep) =>
                                Math.min(prevStep + 1, questions.length),
                              );
                            }}
                          >
                            {currentQuestion?.options?.map(
                              (option: any, index: number) => {
                                return (
                                  <Radio.Root
                                    key={index}
                                    value={option.value}
                                    className={cn(
                                      "group flex items-center gap-3.5 px-5 py-4.5 cursor-pointer font-unbounded rounded-lg hover:bg-white/20" +
                                        " transition-all duration-300 ease-linear text-white/60 hover:text-white/80 active:bg-white/30 active:text-white",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "w-2 h-2 rounded-full shrink-0 transition-colors duration-200 bg-white/60 group-hover:bg-white/80 group-active:bg-white",
                                      )}
                                    />
                                    {/*<Radio.Indicator />*/}
                                    {option.text}
                                  </Radio.Root>
                                );
                              },
                            )}
                          </RadioGroup>
                        );
                      }}
                    </form.Field>
                  </div>
                </div>

                <div className="flex justify-center pb-12 w-full">
                  <ProgressBar
                    label={pageContentData?.splash.label}
                    total={questions.length}
                    current={step}
                  />
                </div>
              </form>
            </div>
          )}
        </Vstack>
      </Container>

      <CloseDrawer
        currentState="mcq"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </main>
  );
}
