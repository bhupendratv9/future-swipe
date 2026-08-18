import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import Header from "@/components/header/Header.tsx";
import SignInLockIconSvg from "@/components/svgs/icons/SignInLockIconSVG.tsx";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton.tsx";
import GoogleIconSvg from "@/components/svgs/icons/GoogleIconSVG.tsx";
import { motion } from "motion/react";
import logo from "@/assets/splash/logo.png";
import GradientCard from "@/components/common/GradientCard.tsx";
import brainImg from "@/assets/result/brain.png";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { useGuestSignupMutation } from "@/queries/mutations/guest-signup-mutation.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useGetProfileQuery } from "@/queries/get-profile-query.ts";
import { queryClient } from "@/lib/queryClient.ts";
import {
  encryptRouterPath,
  hardNavigateToAppPath,
  isProfileIncomplete,
  resolvePostAuthPath,
} from "@/lib/auth-redirect.ts";
import { useSwipeStore } from "@/store/swipeStore.ts";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/(auth)/_auth/sign-in")({
  validateSearch: searchSchema,
  beforeLoad: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["signin", getAppLanguage()],
      queryFn: () => getPageContent("signin", getAppLanguage()),
    });
  },
  component: RouteComponent,

});

function RouteComponent() {
  const signingMutation = useGuestSignupMutation();

  const router = useRouter();

  const { i18n } = useTranslation();

  const search = Route.useSearch();

  const redirect = search?.redirect;

  const { sessionId } = useSwipeStore();

  const { data: profile } = useGetProfileQuery();

  const userData = profile?.data?.user;

  const { data:pageData } = useQuery({
    queryKey: ["signin", i18n.language],
    queryFn: () => getPageContent("signin", getAppLanguage()),
  });


  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const formData = new FormData();

      formData.append("type", "google");
      formData.append("access_token", tokenResponse.access_token);
      if (userData) {
        formData.append("guest_user_id", userData?.id);
      }
      if (
        sessionId &&
        sessionId !== "undefined" &&
        sessionId !== "null" &&
        sessionId !== ""
      ) {
        formData.append("session_id", sessionId);
      }

      signingMutation.mutate(formData, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });

          queryClient.refetchQueries({ queryKey: ["profile"] });

          const user = res?.data?.user;
          const fallbackPath = sessionId ? "/result-unlock" : "/dashboard";
          const targetPath = resolvePostAuthPath(redirect, fallbackPath);

          if (isProfileIncomplete(user)) {
            router.navigate({
              to: "/complete-profile",
              search: { redirect: encryptRouterPath(targetPath) },
            });
          } else {
            hardNavigateToAppPath(targetPath);
          }

          toast.success("Login successful");
        },
        onError: (error) => {
          console.error("Error during guest signup:", error);
        },
      });
    },
    onError: () => {
      toast.error("Login Failed");
    },
  });

  const handleGuestSignup = () => {
    router.navigate({to: "/guest-signup", search: { redirect: redirect }, replace: true})
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
      />
      <Vstack size="sm">
        <Container>
          <motion.div
            initial={{ y: 600, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
            className="max-w-93 mx-auto space-y-16"
          >
            <div className="space-y-6">
              {/*<div className="space-y-6 px-5">*/}
              {/*  /!* <div className="size-25">*/}
              {/*    <img src={logoGif} alt="" />*/}
              {/*  </div>*/}

              {/*  <div className="space-y-2">*/}
              {/*    <p className="text-secondary font-unbounded text-xl leading-8">*/}
              {/*      100% Completed*/}
              {/*    </p>*/}
              {/*    <div className="w-full flex gap-1">*/}
              {/*      {Array.from({ length: 10 }, (_, index) => {*/}
              {/*        return (*/}
              {/*          <div*/}
              {/*            className="rounded-full w-full bg-secondary h-1"*/}
              {/*            key={index}*/}
              {/*          ></div>*/}
              {/*        );*/}
              {/*      })}*/}
              {/*    </div>*/}
              {/*  </div>*/}

              {/*  <div className="space-y-1">*/}
              {/*    <p className="font-unbounded text-xl leading-8">*/}
              {/*    {t("signin.match.title")}*/}
              {/*    </p>*/}
              {/*    <p className="font-light leading-6.5">*/}
              {/*       {t("signin.match.subTitle")}*/}
              {/*    </p>*/}
              {/*  </div> *!/*/}
              {/*</div>*/}

              <GradientCard innerClass="relative">
                <div className="grid gap-6 justify-center max-w-3xl w-auto">
                  <div className="flex justify-center items-center gap-4">
                    <img src={brainImg} alt="strategirst-icon" />

                    <h2 className="h3">
                      You Are{" "}
                      <span className="block text-secondary">
                        The Strategist
                      </span>
                    </h2>
                  </div>
                  <p className="p-md text-center">
                    You think ahead, analyze deeply and make smart decisions.
                  </p>
                </div>

                <div className="absolute inset-0 size-full bg-linear-to-b backdrop-blur-sm from-secondary/6 to-[#5CE1E6]/6 squircle flex items-center justify-center">
                  <SignInLockIconSvg />
                </div>
              </GradientCard>

              <div className="mx-auto bg-white/20 px-5 py-2.5 rounded-full text-xs font-medium w-max">
                {pageData?.data?.signin?.badge}
              </div>
            </div>

            <div className="space-y-2.5">
              <GradientAnimatedButton
                onClick={() => googleLogin()}
                icon={<GoogleIconSvg />}
                buttonText={pageData?.data?.signin?.google}
              />

              {userData?.is_guest !== 1 && (
                <>
                  <div className="h-8.75 flex items-center relative">
                    <div className="h-0.5 rounded-full bg-white/10 w-full"></div>
                    <div className="absolute h-full w-9.5 top-0 left-1/2 -translate-x-1/2 bg-black flex items-center justify-center">
                      <p className="">{pageData?.data?.signin?.orlabel}</p>
                    </div>
                  </div>

                  <button onClick={handleGuestSignup} className="flex justify-center cursor-pointer mx-auto font-semibold text-secondary">

                      {pageData?.data?.signin?.guest}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </Container>
      </Vstack>
    </motion.main>
  );
}
