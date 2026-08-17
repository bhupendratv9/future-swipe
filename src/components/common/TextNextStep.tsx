import GradientAnimatedButton from "./GradientAnimatedButton";
import BookmarkIconSvg from "../svgs/icons/BookmarkIconSVG";
import ShareSVG from "../svgs/icons/ShareSVG";
import { cn } from "@/lib/utils";
import CTAButton from "./CTAButton";
import PlayAgainSVG from "../svgs/icons/PlayAgainSVG";
import { useRouter } from "@tanstack/react-router";
import {
  useCreateSaveResult,
  useDeleteSaveResult,
} from "@/queries/result.query";
import { useSwipeStore } from "@/store/swipeStore";
import { toast } from "sonner";
import { useSaveResults } from "@/queries/profile.query";
import { useTranslation } from "react-i18next";
import {queryClient} from "@/lib/queryClient.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";

type Props = {
  className?: string;
  onShareClick?: () => void;
  variant?: "result" | "insight";
  isRegisteredUser?: boolean;
  isSaved?: boolean;
};
const TextNextStep = ({
  className,
  onShareClick,
  variant,
  isRegisteredUser,
  isSaved,
}: Props) => {
  const router = useRouter();
  const { sessionId } = useSwipeStore();
  const { i18n } = useTranslation();

  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data;

  const { data: saveResult } = useSaveResults({ lang: getAppLanguage()});

  const matchedItem = saveResult?.data?.results?.find(
    (item: any) => item.session_id === Number(sessionId),
  );
  const resultId = matchedItem?.result_id;

  const { mutate: createSaveResult } = useCreateSaveResult();
  const { mutate: deleteSaveResult } = useDeleteSaveResult();

  const handleSaveResult = async () => {
    if (!isRegisteredUser) {
      toast.error("Please log in to save your results", {
        action: {
          label: "Login",
          onClick: () => router.navigate({ to: "/profile" }),
        },
      });
      return;
    }

    const savePayload = { session_id: sessionId, lang: getAppLanguage() };

    const deletePayload = {
      result_id: String(resultId),
    };

    if (isSaved) {
      deleteSaveResult(deletePayload, {
        onSuccess: (res: any) => {
          queryClient.invalidateQueries({ queryKey: ["results"] });
          toast.success(res?.message || "Result removed");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Error removing result");
        },
      });
    } else {
      createSaveResult(savePayload, {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Result saved successfully");
          queryClient.invalidateQueries({ queryKey: ["results"] });
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const message = err?.response?.data?.message;

          if (status === 400) {
            toast.info(message);
            return;
          }
          toast.error(message || "Something went wrong");
        },
      });
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex flex-1 flex-col gap-4 w-full">
        {/* Heading */}
        <div className="mb-3">
          <h3 className="text-[#FFFFFFB2] textg-[20px] lg:text-[24px] leading-9 font-unbounded m-0 mb-2">
            {pageContent?.screen.nextStep.heading}
          </h3>
          <p className="text-[#FFFFFF] text-[14px] md:text-[18px] leading-5.5 font-montserrat">
            {pageContent?.screen.nextStep.desc}
          </p>
        </div>
        <div
          className={
            variant === "insight"
              ? "flex flex-col-reverse gap-4"
              : "flex flex-col gap-4"
          }
        >
          <div className="flex-1 flex flex-col [@media(min-width:375px)]:flex-row  items-center gap-2">
            <div className="w-full">
              <GradientAnimatedButton
                onClick={() => router.navigate({ to: "/gameplay" })}
                icon={<PlayAgainSVG />}
                buttonText={pageContent?.screen?.nextStep.buttons.play}
                className="rounded-8 p-0.5"
                textClassName="py-[12px] px-[18px] text-base"
              />
            </div>
            <div className="w-full">
              <CTAButton
                onClick={handleSaveResult}
                icon={
                  <BookmarkIconSvg
                    height={20}
                    width={20}
                    fillColor={isSaved ? "white" : ""}
                  />
                }
                className="w-full rounded-4xl bg-button-secondary backdrop-blur-none py-4 gap-0.5 text-nowrap"
                text={
                  isSaved
                    ? pageContent?.screen.nextStep.buttons.result.remove
                    : pageContent?.screen.nextStep.buttons.result.save
                }
              />
            </div>
          </div>

          <div>
            <CTAButton
              icon={<ShareSVG />}
              className="w-full rounded-[100px] bg-[#F0F0F04D] backdrop-blur-xl px-8 py-3.5 "
              text={pageContent?.screen.nextStep.buttons.share}
              glassEffect
              onClick={onShareClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextNextStep;
