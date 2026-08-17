import { createFileRoute, redirect, isRedirect } from "@tanstack/react-router";
import { getProfile } from "@/api/services/get-profile.ts";
import { queryClient } from "@/lib/queryClient.ts";

const SIGN_IN_PATH = "/sign-in";
const DASHBOARD_PATH = "/dashboard";

export const Route = createFileRoute("/(auth)/_auth")({
	beforeLoad: async ({ location }) => {
		const { pathname } = location;

		if (pathname === "/guest-signup") {
			return;
		}

		try {
			const profile = await queryClient.ensureQueryData({
				queryKey: ["profile"],
				queryFn: getProfile,
			});

			if(!profile){
				return
			}

			const isGuest = profile?.data?.user?.is_guest === 1;

			if (pathname === SIGN_IN_PATH && isGuest) return;

			if (!isGuest) {
				throw redirect({ to: DASHBOARD_PATH });
			}

		} catch (error) {
			if (isRedirect(error)) throw error;
		}
	}
});