import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import type { LinkProps } from "@tanstack/react-router";

import avatarPlaceholder from "@/assets/common/profile-placeholder.png";
import EditProfileIconSvg from "@/components/svgs/icons/EditProfileIconSVG.tsx";
import BookmarkIconSvg from "@/components/svgs/icons/BookmarkIconSVG.tsx";
import InsightsIconSvg from "@/components/svgs/icons/InsightsIconSVG.tsx";
import LikeIconSvg from "@/components/svgs/icons/LikeIconSVG.tsx";
import HelpCenterIconSvg from "@/components/svgs/icons/HelpCenterIconSVG.tsx";
import ProfileChevronIconSvg from "@/components/svgs/icons/ProfileChevronIconSVG.tsx";
import DeleteIconSvg from "@/components/svgs/icons/DeleteIconSVG.tsx";
import LogoutIconSvg from "@/components/svgs/icons/LogoutIconSVG.tsx";
import { usePreviousRoute } from "@/hooks/usePreviousRoute.tsx";
import React, { useState } from "react";
import { motion } from "motion/react";
import Header from "@/components/header/Header.tsx";
import EducationLogo from "@/components/custom/home/EducationLogo.tsx";
import BackButton from "@/components/common/BackButton.tsx";
import DeleteAccountDrawer from "@/components/custom/profile/DeleteAccountDrawer.tsx";
import { useLogoutMutation } from "@/queries/mutations/logout-mutation.ts";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils.ts";
import GoogleIconSvg from "@/components/svgs/icons/GoogleIconSVG.tsx";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton.tsx";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useGuestSignupMutation } from "@/queries/mutations/guest-signup-mutation.ts";
import { queryClient } from "@/lib/queryClient.ts";
import LogoutDrawer from "@/components/custom/profile/LogoutDrawer";
import { useSwipeStore } from "@/store/swipeStore";
import { getGameStatusData } from "@/queries/get-game-status-query.ts";
import { getProfile } from "@/api/services/get-profile.ts";
import {useGetProfileQuery} from "@/queries/get-profile-query.ts";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import { encryptRouterPath, isProfileIncomplete } from "@/lib/auth-redirect.ts";

type routeType = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link?: LinkProps["to"];
  replaceLink?: boolean;
  guestHidden?: boolean;
};

export const Route = createFileRoute(
  "/(authenticated-routes)/_authenticated/profile/",
)({
  beforeLoad: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["profile"],
      queryFn: getProfile,
    });
    await queryClient.ensureQueryData({
      queryKey: ["profile_page", getAppLanguage()],
      queryFn: () => getPageContent("profile_page", getAppLanguage()),
    });
  },
  loader: async () => {
    try {
      const { data: gameState } = await queryClient.fetchQuery({
        queryKey: ["game-state"],
        queryFn: getGameStatusData,
      });
      return { gameState };
    } catch {
      return { profile: null };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { gameState } = Route.useLoaderData();

  const router = useRouter();

  const { sessionId } = useSwipeStore();

  const logoutMutation = useLogoutMutation();

  const {data} = useGetProfileQuery();

  const profileData = data?.data?.user;

  const [openDelete, setOpenDelete] = useState(false);

  const isGamePlay =
    gameState?.is_mcq_done &&
    gameState?.is_round_two_complete &&
    gameState?.is_round_one_complete;

  const showLink = profileData?.is_guest !== 1;

  const setSessionId = useSwipeStore((state) => state.setSessionId);

  const { i18n } = useTranslation();

  const { data: profilePageData } = useQuery({
    queryKey: ["profile_page", i18n.language],
    queryFn: () => getPageContent("profile_page", getAppLanguage()),
  });

  const { data: buttonData } = useQuery({
    queryKey: ["button_page", i18n.language],
    queryFn: () => getPageContent("button_page", getAppLanguage()),
  });

  const buttonContent = buttonData?.data;

  const routes: routeType[] = [
    {
      name: profilePageData?.data?.menu?.insight,
      icon: InsightsIconSvg,
      link: isGamePlay ? "/insight" : "/gameplay",
    },
    {
      name: profilePageData?.data?.menu?.result?.heading,
      icon: BookmarkIconSvg,
      link:  "/profile/saved-results",
      replaceLink: true,
      guestHidden: !showLink,
    },
    {
      name: profilePageData?.data?.menu.universities.like,
      icon: LikeIconSvg,
      link: "/profile/liked-universities",
      replaceLink: true,
      guestHidden: !showLink,
    },
    {
      name: profilePageData?.data?.menu.help.heading,
      icon: HelpCenterIconSvg,
      link: "/help-center",
      replaceLink: true,
    },
    // { name: "Notifications", icon: NotificationIconSvg },
  ];

  const previousPath = usePreviousRoute();

  const backPaths: LinkProps["to"][] = [
    "/profile/update",
    "/help-center",
    "/profile/saved-results",
    "/profile/liked-universities",
    "/profile",
  ];

  const handleBackClick = () => {
    if (backPaths.includes(previousPath as LinkProps["to"])) {
      router.history.go(-2);
    } else {
      router.history.back();
    }
  };

  const handleRouting = (route: routeType["link"], replaceLink?: boolean) => {
    router.navigate({ to: route, replace: replaceLink });
  };

  const date = new Date(profileData?.created_at);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const signingMutation = useGuestSignupMutation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const formData = new FormData();

      formData.append("type", "google");
      formData.append("access_token", tokenResponse.access_token);

      if (profileData) {
        formData.append("guest_user_id", profileData?.id);
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
          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });

          queryClient.refetchQueries({
            queryKey: ["profile"],
          });

          const user = res?.data?.user;

          if (isProfileIncomplete(user)) {
            router.navigate({
              to: "/complete-profile",
              search: { redirect: encryptRouterPath("/profile") },
            });
          } else {
            router.navigate({ to: "/profile" });
          }

          toast.success("Login successful");
        },
        onError: () => {
          toast.error("Error during guest signup");
        },
      });
    },
    onError: () => {
      toast.error("Login Failed");
    },
  });

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
                handleBackClick();
              }}
            />
            <p className="h2">{profilePageData?.data?.heading}</p>
          </div>
        }
      />
      <Vstack size="sm">
        <Container className="max-w-120">
          <motion.div
            initial={{ y: 600, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
            className="max-w-93 mx-auto flex flex-col gap-5 h-full min-h-[80vh] justify-between"
          >
            <div className="space-y-5">
              <div className="bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px w-full shadow-2xl shadow-black/10 squircle">
                <div className="bg-black squircle">
                  <div className="bg-linear-to-b from-secondary/6 to-[#5CE1E6]/6 p-7.5 space-y-2.5 squircle font-montserrat">
                    {showLink ? (
                      <div className="space-y-2.5">
                        <div className="flex gap-5">
                          <img
                            src={profileData?.image || avatarPlaceholder}
                            className="size-11.5 object-cover rounded-full"
                            alt="avatar"
                          />
                          <div>
                            <p className="text-xs text-[#8F959E]">
                              Since {formattedDate}
                            </p>
                            <h4>{profileData?.name || ""}</h4>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-xs text-text-primary/60">
                            {profileData?.email || ""}
                          </p>

                          {/*  Normal navigation (no replace here) */}
                          <Link
                            to="/profile/update"
                            replace={true}
                            className="flex items-center gap-2.5"
                          >
                            <EditProfileIconSvg />
                            <p className="text-secondary font-semibold text-[13px]">
                              {profilePageData?.data?.edit}
                            </p>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center min-h-32">
                        <GradientAnimatedButton
                          onClick={() => googleLogin()}
                          icon={<GoogleIconSvg />}
                          buttonText={buttonContent?.form?.google}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {routes.map((route, index) => (
                  <button
                    key={index}
                    onClick={
                      route.link
                        ? () =>
                            handleRouting(
                              route.link,
                              route.replaceLink ? route.replaceLink : false,
                            )
                        : () => {}
                    }
                    className={cn(
                      "p-4.5 border border-white/6 rounded-lg flex justify-between cursor-pointer w-full",
                      route?.guestHidden ? "hidden" : "",
                    )}
                  >
                    <div className="flex gap-4.5 items-center">
                      <route.icon />
                      <p>{route.name}</p>
                    </div>
                    <ProfileChevronIconSvg />
                  </button>
                ))}

                {showLink && (
                  <DeleteAccountDrawer
                    trigger={
                      <div className="p-4.5 border border-white/6 rounded-lg flex justify-between w-full cursor-pointer">
                        <div className="flex gap-4.5 items-center">
                          <DeleteIconSvg />
                          <p>{profilePageData?.data?.menu?.delete?.heading}</p>
                        </div>
                        <ProfileChevronIconSvg />
                      </div>
                    }
                    open={openDelete}
                    onOpenChange={setOpenDelete}
                  />
                )}

                {showLink && (
                  <LogoutDrawer
                    onClick={() => {
                      setSessionId("");
                      logoutMutation.mutate();
                    }}
                    trigger={
                      <div
                        // onClick={() => logoutMutation.mutate()}
                        className="p-4.5 border border-white/6 rounded-lg flex justify-between cursor-pointer w-full"
                      >
                        <div className="flex gap-4.5 items-center">
                          <LogoutIconSvg />
                          <p className="text-[#D26A5C]">{profilePageData?.data?.menu.logout}</p>
                        </div>
                        <ProfileChevronIconSvg />
                      </div>
                    }
                  />
                )}
              </div>
            </div>

            <EducationLogo />
          </motion.div>
        </Container>
      </Vstack>
    </motion.main>
  );
}
