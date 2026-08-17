import { cn } from "@/lib/utils";
import educationSvg from "@/assets/svg/education.svg";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import {useTranslation} from "react-i18next";

type CourseDetails = {
  what_you_learn?: string[];
  career_path?: string[];
};

type Props = {
  className?: string;
  data?: CourseDetails;
};

type CardType = {
  title: string;
  image: string;
  items: string[];
};

const ListCard = ({ className, data }: Props) => {
  const { i18n } = useTranslation();
  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data?.degree?.orderList;

  const formattedData: CardType[] = [
    {
      title: pageContent[1],
      image: educationSvg,
      items: data?.what_you_learn || [],
    },
    {
      title: pageContent[2],
      image: educationSvg,
      items: data?.career_path || [],
    },
  ];

  return (
    <>
      <div className={cn("relative", className)}>
        {formattedData.map((card, index) => (
          <div
            key={index}
            className="border border-[#FFFFFF0F] rounded-lg p-4 space-y-3"
          >
            <div className="flex gap-2.5 item-center">
              <img src={card.image} alt="icon" className="size-6.5" />
              <h2 className="font-medium font-instrument text-base">
                {card.title}
              </h2>
            </div>

            <ul className="custom-list list-disc marker:text-[5px] list-inside pl-2">
              {card.items.length > 0 ? (
                card.items.map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <p className="text-gray-400 pl-2">No data available</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListCard;
