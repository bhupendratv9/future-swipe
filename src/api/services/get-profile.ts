import axiosPrivate from "@/api/axiosPrivate.ts";


export const getProfile = async () => {
  try {
    const res = await axiosPrivate.get("/profile");
    return res.data;
  } catch (error:unknown) {
    console.error("err",error);
    throw error;
  }
};
