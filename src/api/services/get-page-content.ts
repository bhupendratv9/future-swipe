import axiosPublic from "@/api/axiosPublic.ts";

export const getPageContent = async (pageName:string, lang:string) => {
  const res = await axiosPublic.post("/get-page-content", {
    "page_name": pageName, "lang": lang
  });

  return res?.data;
}