import SaveResultCard from "@/components/custom/saveResult/SaveResultCard";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import BackButton from "@/components/common/BackButton";
import Header from "@/components/header/Header";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import { motion } from "motion/react";
import { useSaveResults } from "@/queries/profile.query";
import ErrorState from "@/components/common/ErrorState";
import { useTranslation } from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import {queryClient} from "@/lib/queryClient.ts";

export const Route = createFileRoute(
  "/(authenticated-routes)/_authenticated/profile/_with-login/saved-results",
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
  const { i18n} = useTranslation();
  const { data, error, refetch } = useSaveResults({
    lang: i18n?.language ?? "en",
    result_id: "",
  });

  const { data: profilePageData } = useQuery({
    queryKey: ["profile_page", i18n.language],
    queryFn: () => getPageContent("profile_page", getAppLanguage()),
  });

  const savedPageData = profilePageData?.data?.menu?.result;

  const resultData = data?.data?.results || [];
  const isNotFound = error;
  const isServerError = error?.response?.status === 500;

  const handleBack = () => {
    router.navigate({
      to: "/profile",
      replace: true,
    });
  };

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
            <p className="h2">{savedPageData.heading}</p>
          </div>
        }
      />
      <Vstack size="sm">
        <Container>
          {isNotFound ? (
            <h2 className="text-primary-70 h2 absolute top-1/2 left-1/2 -translate-1/2 text-center ">
              You haven’t saved any result yet.
            </h2>
          ) : (
            <motion.div
              initial={{ y: 600, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
              className="max-w-93 mx-auto flex flex-col gap-5 h-full min-h-[80vh] justify-between"
            >
              <SaveResultCard buttonText={savedPageData.button} savedText={savedPageData.saved} data={resultData} />
            </motion.div>
          )}
        </Container>
      </Vstack>
    </motion.main>
  );
}
