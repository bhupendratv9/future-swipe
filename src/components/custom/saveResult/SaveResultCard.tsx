import CTAButton from "@/components/common/CTAButton";
import RightArrowSVG from "@/components/svgs/icons/RightArrowSVG";
import BookmarkFilledIconSvg from "@/components/svgs/icons/BookmarkFilledIconSVG.tsx";
import GradientCard from "@/components/common/GradientCard.tsx";
import { getTimeAgo } from "@/lib/timeAgo";
import type { SavedResultItem } from "@/types/profile";
import { useRouter } from "@tanstack/react-router";
import { useDeleteSaveResult } from "@/queries/result.query.ts";
import { toast } from "sonner";
import { useSwipeStore } from "@/store/swipeStore.ts";
import {queryClient} from "@/lib/queryClient.ts";

type Props = {
  data: SavedResultItem[];
  buttonText?: string;
  agoText?: string;
  savedText?: string;
};

const SaveResultCard = ({ data,buttonText = "", savedText="" }: Props) => {
  const router = useRouter();

  const deleteResultMutation = useDeleteSaveResult();

  const { setSessionId } = useSwipeStore();

  const deleteResult = (id: string) => {
    const deletePayload = {
      result_id: id,
    };
    deleteResultMutation.mutate(deletePayload, {
      onSuccess: (res) => {
        toast.success(res?.message || "Result removed 💔");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Error removing result");
      },
    });
  };

  const exploreClick = (id: string) => {
    setSessionId(id);
    queryClient.invalidateQueries({ queryKey: ["results"] });
    router.navigate({ to: "/result-unlock" });
  };


  return (
    <div className="flex flex-col gap-5">
      {data.map((item, index) => (
        <GradientCard key={index} innerClass="space-y-3.5">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-19.25 h-20 shrink-0">
              <img
                src={item.persona?.photo}
                alt={item.persona?.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-[#DEDB00] font-unbounded  text-lg leading-tight">
                {item.persona?.name}
              </h3>
              <p className="text-[#FFFFFF] font-montserrat font-normal text-xs leading-relaxed opacity-90">
                {item.persona?.description}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#FFFFFF1A]"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => deleteResult(String(item?.result_id))}
                className="cursor-pointer"
              >
                <BookmarkFilledIconSvg />
              </button>
              <p className="text-[#FFFFFF] font-montserrat font-normal text-sm">
                {savedText} {getTimeAgo(item.created_at)}
              </p>
            </div>

            <button onClick={() => exploreClick(String(item?.session_id))}>
              <CTAButton
                text={buttonText}
                glassEffect
                icon={<RightArrowSVG />}
                className="font-montserrat rounded-[100px] bg-[#F0F0F04D] flex-row-reverse w-25 h-8"
              />
            </button>
          </div>
        </GradientCard>
      ))}
    </div>
  );
};

export default SaveResultCard;
