import ShareSVG from "@/components/svgs/icons/ShareSVG.tsx";
import CTAButton from "@/components/common/CTAButton.tsx";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPageContent } from "@/api/services/get-page-content.ts";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";

type Props = {
  title?: string;
};

const ShareButton = ({ title = "Future Swipe" }: Props) => {
  const { i18n } = useTranslation();
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: title,
        url: import.meta.env.VITE_BASE_URL,
      });
    } else {
      await navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL);
      toast.warning("Link copied to clipboard!");
    }
  };

  const { data } = useQuery({
    queryKey: ["button_page", i18n.language],
    queryFn: () => getPageContent("button_page", getAppLanguage()),
  });

  return (
    <>
      <CTAButton
        onClick={() => {
          handleShare();
        }}
        className="flex-row-reverse items-center cursor-pointer"
        text={data?.data?.share.label}
        icon={<ShareSVG />}
        glassEffect
        asChild
      />
    </>
  );
};

export default ShareButton;
