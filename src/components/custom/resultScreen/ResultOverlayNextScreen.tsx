import BackButton from "@/components/common/BackButton";
import GradientCard from "@/components/common/GradientCard";
import Header from "@/components/header/Header";
import { Container } from "@/components/layout/Container";
import { Vstack } from "@/components/layout/Vstack";
import { motion } from "motion/react";
import ListCard from "../result/ListCard";

import gradientCircle from "@/assets/insight/right-cut-circle.png";

import { useTranslation } from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

// import BestFitCard from "./BestFitCard";
// import { courseData } from "@/data/courseData";

type Props = {
  courseId?: number;
  onClose: () => void;
  isRegisteredUser?: boolean;
  data: any;
};

const ResultOverlayNextScreen = ({ courseId, onClose, data }: Props) => {
  const { i18n } = useTranslation();

  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  })

  const pageContent = pageData.data?.data;

  const courseDetails = data?.data?.related_universities;
  const UniversityData = courseDetails?.find(
    (item: any) => String(item.id) === String(courseId),
  );

  return (
    <motion.section
      key={courseId}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-100 bg-black overflow-y-auto"
    >
      <Header left={<BackButton onClick={onClose} />} />
      <Container>
        <img
          src={gradientCircle}
          alt="circle"
          className="absolute top-0 right-0"
        />

        <Vstack className="space-y-6">
          <div className="space-y-3">
            <h1 className="h1 mt-6">{UniversityData?.name}</h1>
            <p className="span-light text-[#FFFFFF99] pb-3">
              {UniversityData?.duration}
            </p>
          </div>
          <GradientCard>
            <div className="">
              <h3 className="h3-md">{pageContent?.degree.perfectText}</h3>
              <p className="p-light font-light mt-4">
                {UniversityData?.why_perfect}
              </p>
            </div>
          </GradientCard>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GradientCard
              innerClass={"py-4"}
              className="col-span-1 md:col-span-1"
            >
              <div className="flex flex-col gap-2">
                <span className="span-light w-fit text-gradient bg-linear-to-r gradient-one">
                  {pageContent?.degree.eligibility}
                </span>
                <span className="span-regular font-light span-regular">
                  {UniversityData?.eligibility}
                </span>
              </div>
            </GradientCard>
            <GradientCard
              innerClass="py-4"
              className="col-span-1 md:col-span-1"
            >
              <div className="flex flex-col gap-2">
                <span className="span-light w-fit text-gradient bg-linear-to-r gradient-one">
                  {pageContent?.degree.mode}
                </span>
                <span className="span-regular font-light span-regular">
                  {UniversityData?.mode ? UniversityData?.mode : "N/A"}
                </span>
              </div>
            </GradientCard>

            <GradientCard
              innerClass="py-4"
              className="col-span-2 md:col-span-1"
            >
              <div className="flex flex-row md:flex-col gap-2">
                <span className="span-light text-[14px] w-fit text-gradient bg-linear-to-r gradient-one">
                  {pageContent?.degree.fees}
                </span>
                <span className="span-regular font-light span-regular">
                  {Number(data?.data?.fees) === 0
                    ? "Free"
                    : `₹${Number(data?.data?.fees).toLocaleString("en-IN")}`}
                </span>
              </div>
            </GradientCard>
          </div>
          {/* lest cards */}
          <ListCard
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data={UniversityData}
          />
        </Vstack>
      </Container>
    </motion.section>
  );
};

export default ResultOverlayNextScreen;
