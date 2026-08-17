import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { getProfile } from "@/api/services/get-profile.ts";
import {encryptionUtils} from "@/lib/encryption.ts";
import {queryClient} from "@/lib/queryClient.ts";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";

export const Route = createFileRoute("/(authenticated-routes)/_authenticated")({
  beforeLoad: async () => {
    try {
      // Check if user has a token first
      const token = localStorage.getItem("access_token");
      if (!token) {
        const encryptedPathname = encryptionUtils.encrypt(location.pathname);
        throw redirect({
          to: "/sign-in",
          search: { redirect: encryptedPathname },
        });
      }

      // Remove any stale cached profile data before fetching
      const cachedProfile = queryClient.getQueryData(["profile"]);
      if (!cachedProfile) {
        queryClient.removeQueries({ queryKey: ["profile"] });
      }

      const { data: profile } = await queryClient.fetchQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
        staleTime: 0, // Always fetch fresh
      })

      if (location.pathname === "/sign-in") return;

      const encryptedPathname = encryptionUtils.encrypt(location.pathname);

      const user = profile?.user;

      const isProfileIncomplete =
        user.age === null ||
        user.qualification === null ||
        user.gender === null;

      const isGuest = user.is_guest === 1;

      if (!profile) {
        throw redirect({
          to: "/sign-in",
          search: {
            redirect: encryptedPathname,
          },
        });
      }

      if (!isGuest && isProfileIncomplete && location.pathname !== "/complete-profile") {
        throw redirect({
          to: "/complete-profile",
          search: { redirect: encryptedPathname },
        });
      }

      await queryClient.ensureQueryData({
        queryKey: ["button_page", getAppLanguage()],
        queryFn: () => getPageContent("button_page", getAppLanguage()),
      })

    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }

      // If token exists but profile failed, don't redirect - let the page handle it
      const token = localStorage.getItem("access_token");
      if (token && location.pathname === "/result-unlock") {
        return; // Allow result-unlock to load even if profile fails
      }

      if (location.pathname === "/sign-in") return;

      const encryptedPathname = encryptionUtils.encrypt(location.pathname);

      throw redirect({
        to: "/sign-in",
        search: { redirect: encryptedPathname },
      });
    }
  },
});
