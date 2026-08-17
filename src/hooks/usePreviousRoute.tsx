// usePreviousRoute.ts
import { useRouter } from "@tanstack/react-router";

// 🔥 global sync store (no React state)
let previousRoute = "";

export const usePreviousRoute = () => {
  const router = useRouter();

  // subscribe ONCE (no re-renders needed)
  if (!(router as any).__hasPrevRouteListener) {
    (router as any).__hasPrevRouteListener = true;

    router.subscribe("onBeforeNavigate", ({ fromLocation }) => {
      previousRoute = fromLocation?.pathname || "";
    });
  }

  return previousRoute;
};