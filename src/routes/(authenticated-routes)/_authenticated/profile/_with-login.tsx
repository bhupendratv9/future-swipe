import {createFileRoute, isRedirect, redirect} from '@tanstack/react-router'
import {queryClient} from "@/lib/queryClient.ts";
import {getProfile} from "@/api/services/get-profile.ts";
import { encryptRouterPath } from "@/lib/auth-redirect.ts";

export const Route = createFileRoute(
  '/(authenticated-routes)/_authenticated/profile/_with-login',
)({
  beforeLoad: async ({ location }) => {
    try{
      const { data: profile } = await queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getProfile,
      })

      if (location.pathname === "/sign-in") return;

      const encryptedPathname = encryptRouterPath(location.pathname);

      if(profile?.user?.is_guest === 1){
        throw redirect({
          to: "/sign-in",
          search: {
            redirect: encryptedPathname,
          },
        });
      }

    }catch (error) {
      if (isRedirect(error)) {
        throw error;
      }

      if (location.pathname === "/sign-in") return;

      const encryptedPathname = encryptRouterPath(location.pathname);

      throw redirect({
        to: "/sign-in",
        search: { redirect: encryptedPathname },
      });
    }
  }
})


