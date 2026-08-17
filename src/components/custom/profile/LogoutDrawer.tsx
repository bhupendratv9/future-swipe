import { Drawer } from "@base-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
import {getPageContent} from "@/api/services/get-page-content.ts";

type Props = {
    trigger?: React.ReactNode;
    onClick?: () => void;
};

export default function LogoutDrawer({ trigger, onClick }: Props) {
  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryKey: ["logout_screen_page", i18n.language],
    queryFn: () => getPageContent("logout_screen_page", getAppLanguage()),
  });

  const logoutDrawerData = data?.data?.logout_screen;

  return (
    <Drawer.Root swipeDirection="down">
      <Drawer.Trigger className={"w-full"}>{trigger}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-all data-starting-style:opacity-0 data-ending-style:opacity-0" />

        <Drawer.Viewport className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50 flex flex-col focus:outline-none max-w-103 md:max-w-160 w-full">
          <Drawer.Popup className="bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px rounded-t-[30px] shadow-xl transition-all duration-300 ease-out transform data-starting-style:translate-y-full data-ending-style:translate-y-full">
            {/* Content: Padding and the handle */}
            <Drawer.Content className="bg-black rounded-t-[30px] p-5 text-white font-montserrat w-full">
              <p className="text-sm md:text-lg text-white/70 text-center mb-6">
                {logoutDrawerData?.label}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                {/* Cancel */}
                <Drawer.Close className="flex-1">
                  <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                    {logoutDrawerData?.cancelBtn}
                  </button>
                </Drawer.Close>

                {/* Delete / Yes */}
                <button
                  onClick={onClick}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition cursor-pointer"
                >
                  {logoutDrawerData?.logBtn}
                </button>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
