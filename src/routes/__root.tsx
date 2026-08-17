import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient.ts";
import { useEffect } from "react";

const RootLayout = () => {
  const { i18n } = useTranslation();

  const fontClass =
    i18n.language === "hi" ? "font-devnagari" : "font-montserrat";

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`min-h-screen overflow-hidden ${fontClass} bg-background-primary text-text-primary font-montserrat`}
      >
        <Outlet />
        <Toaster
          expand={false}
          position="bottom-right"
          richColors
          theme="dark"
          toastOptions={{
            className: "font-montserrat",
            duration: 1500,
          }}
        />
        <TanStackRouterDevtools />
      </div>
    </QueryClientProvider>
  );
};

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return null;
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: RootLayout,
});
