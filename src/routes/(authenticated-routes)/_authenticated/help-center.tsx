import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import BackButton from "@/components/common/BackButton.tsx";
import Header from "@/components/header/Header.tsx";
import EducationLogo from "@/components/custom/home/EducationLogo.tsx";
import GradientCard from "@/components/common/GradientCard.tsx";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import ShareCopyIconSvg from "@/components/svgs/icons/ShareCopyIconSVG.tsx";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton.tsx";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPageContent } from "@/api/services/get-page-content.ts";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";
import { queryClient } from "@/lib/queryClient.ts";

export const Route = createFileRoute(
  "/(authenticated-routes)/_authenticated/help-center",
)({
  beforeLoad: async () => {
    await queryClient.ensureQueryData({
      queryKey: ["profile_page", getAppLanguage()],
      queryFn: () => getPageContent("profile_page", getAppLanguage()),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryKey: ["profile_page", i18n.language],
    queryFn: () => getPageContent("profile_page", getAppLanguage()),
  });

  const helpPageData = data?.data?.menu?.help;

  const handleBack = () => {
    router.navigate({
      to: "/profile",
      replace: true,
    });
  };

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
            <p className="h2">{helpPageData?.heading}</p>
          </div>
        }
      />
      <Vstack size="sm">
        <Container>
          <motion.div
            initial={{ y: 600, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
            className="max-w-93 mx-auto flex flex-col gap-5 h-full min-h-[80vh] justify-between"
          >
            <div className="space-y-7.5">
              <GradientCard innerClass="space-y-5">
                <div className="space-y-2.5 text-center">
                  <p className="h3">{helpPageData.card.title}</p>
                  <p className="p-medium">{helpPageData.card.subTitle}</p>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => {
                      const copyPromise = navigator.clipboard.writeText(
                        "support@futureswipe.com",
                      );

                      toast.promise(copyPromise, {
                        loading: "Copying email...",
                        success: "Email copied to clipboard!",
                        error: "Failed to copy email",
                      });
                    }}
                    className="flex gap-2.5 items-center justify-center cursor-pointer"
                  >
                    <ShareCopyIconSvg />
                    <span className="text-secondary font-semibold text-sm">
                      support@futureswipe.com
                    </span>
                  </button>
                </div>
                <div>
                  <GradientAnimatedButton
                    onClick={() => {
                      window.open("mailto:support@futureswipe.com", "_blank");
                    }}
                    buttonText={helpPageData.button}
                  />
                </div>
              </GradientCard>

              <p className="p-light text-center">{helpPageData.message}</p>
            </div>
            <EducationLogo />
          </motion.div>
        </Container>
      </Vstack>
    </motion.main>
  );
}
