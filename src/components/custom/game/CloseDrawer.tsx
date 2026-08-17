import CTAButton from "@/components/common/CTAButton";
import { useRouter } from "@tanstack/react-router";
import { useSwipeStore } from "@/store/swipeStore.ts";
import { useQuery } from "@tanstack/react-query";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";
import { getPageContent } from "@/api/services/get-page-content.ts";
import { useTranslation } from "react-i18next";

type CloseDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  currentState?: string;
};

const CloseDrawer = ({
  isOpen,
  onClose,
  currentState = "cards",
}: CloseDrawerProps) => {
  const router = useRouter();

  const setSessionId = useSwipeStore((s) => s.setSessionId);
  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryKey: ["gameplay_popup_page", i18n.language],
    queryFn: () => getPageContent("gameplay_popup_page", getAppLanguage()),
  });

  const popupContent = data?.data?.gameplay_pop;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed z-999 inset-0 bg-black/30 transition-opacity duration-500 ease-out  ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed z-9999 bottom-0 left-0 w-full max-h-96 bg-black rounded-t-[30px] shadow-lg overflow-y-auto px-4 py-8 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-192.5 w-full mx-auto space-y-8 lg:space-y-12">
          <div className="space-y-3">
            <h2 className="h2 text-center">{popupContent?.heading}</h2>
            <p className="p-light mt-2 text-center px-2">
              {popupContent?.description}
            </p>
          </div>

          <div className="w-full flex items-center gap-4">
            <div
              onClick={() => {
                router.navigate({ to: "/dashboard" });
                setSessionId("");
              }}
              className="w-full"
            >
              <CTAButton
                className="w-full rounded-4xl bg-button-secondary text-background-primary backdrop-blur-none py-3.5"
                text={popupContent?.exitBtn}
              />
            </div>
            <CTAButton
              onClick={onClose}
              className="w-full rounded-4xl bg-white text-background-primary backdrop-blur-none py-3.5"
              text={
                currentState === "mcq"
                  ? popupContent?.mcqcontinueBtn
                  : popupContent?.continueBtn
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CloseDrawer;
