import { forwardRef, useImperativeHandle, useRef } from "react";
import * as htmlToImage from "html-to-image";

import logo from "@/assets/splash/logo.png";
import { cn } from "@/lib/utils.ts";
import { useGetProfileQuery } from "@/queries/get-profile-query.ts";
import type { InsightData } from "@/types/result";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPageContent } from "@/api/services/get-page-content.ts";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";

export type GenerateImageRef = {
  getImageLink: () => Promise<string | null>;
  generateImage: () => Promise<string | null>;
};

type Props = {
  data?: InsightData;
};

const GenerateImage = forwardRef<GenerateImageRef, Props>(({ data }, ref) => {
  const captureRef = useRef<HTMLDivElement | null>(null);
  const { i18n } = useTranslation();

  const pageData = useQuery({
    queryKey: ["result_page", i18n.language],
    queryFn: () => getPageContent("result_page", getAppLanguage()),
  });

  const pageContent = pageData.data?.data;

  // Generate Image
  const generateImage = async () => {
    if (!captureRef.current) return null;

    try {
      const options = {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000",
        includeQueryParams: true,
      };

      // 1. "Warm up" call for iOS - helps Safari trigger the image load/render
      await htmlToImage.toPng(captureRef.current, options);

      // 2. Small delay to ensure the UI thread has painted
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. The actual capture
      return await htmlToImage.toPng(captureRef.current, options);
    } catch (err) {
      console.error("Image generation failed", err);
      return null;
    }
  };

  //  Upload to Cloudinary → return link
  const uploadImage = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return null;

    const blob = await (await fetch(dataUrl)).blob();

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.secure_url;
  };

  //  Expose function outside
  useImperativeHandle(ref, () => ({
    generateImage: generateImage,
    getImageLink: uploadImage,
  }));

  const { data: profile } = useGetProfileQuery();

  const profileData = profile?.data?.user;

  return (
    <div
      ref={captureRef}
      className="flex justify-center items-center w-max rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col gap-3 rounded-2xl bg-black  w-full p-1.5 lg:p-3 max-w-60 lg:max-w-70">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-8 object-contain " />
        </div>

        <div
          className={cn(
            "bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px w-full shadow-2xl shadow-black/10 squircle",
          )}
        >
          <div className="size-full bg-black squircle">
            <div
              className={cn(
                "size-full bg-linear-to-b from-secondary/7 to-[#5CE1E6]/7 squircle p-2.5",
              )}
            >
              <div className="space-y-2.5">
                <div className="flex gap-2.5">
                  <img
                    src={data?.persona?.photo}
                    alt=""
                    className="size-14 object-contain"
                  />
                  <div className="font-unbounded flex flex-col justify-center space-y-1">
                    <p className="text-xs">{profileData?.name} {pageContent?.screen.card.shortText}</p>
                    <p className="text-secondary text-sm lg:text-sm">
                      {data?.persona?.name}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-center">
                  {data?.persona?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-unbounded px-3">
            {pageContent?.insight.quoteHeading}
          </p>
          <div>
            <div className="bg-linear-to-b gradient-two p-px mx-1 rounded-3xl rounded-tl-none">
              <div className="bg-black flex rounded-3xl rounded-tl-none p-2 pb-0 relative h-30 overflow-hidden">
                <div className=" h-full w-[46%]">
                  <div className="relative h-full">
                    <img
                      src={data?.insights[0]?.image}
                      alt=""
                      className="object-cover h-full w-fit"
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center w-[54%] h-full relative z-2">
                  <div className="space-y-1 max-w-40">
                    <p className="font-light text-xs">
                      {pageContent?.insight.quote}
                    </p>
                    <div className="space-y-1">
                      <p className="text-secondary text-xs font-unbounded">
                        {data?.insights[0]?.name}
                      </p>
                      <p className="text-xs font-medium">
                        {data?.insights[0]?.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-xs font-unbounded px-3">
            {" "}
            {pageContent?.insight.popupText +" "+ profileData.name}
          </p>

          <div className="rounded-2xl bg-linear-to-b gradient-two p-3 mx-1">
            <p className="font-light text-[10px]">
              {data?.bestCourse ? data?.bestCourse[0]?.duration : ""}
            </p>
            <p className="font-unbounded text-secondary text-xs">
              {data?.bestCourse ? data?.bestCourse[0]?.name : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

GenerateImage.displayName = "GenerateImage";
export default GenerateImage;
