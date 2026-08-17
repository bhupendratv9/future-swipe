import axios from "axios";

export const getGoogleUser = async (token: any) =>{
  try {
    const data = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
        },
      }
    );

    return data.data;
  } catch (err) {
    console.error(err);
  }
}