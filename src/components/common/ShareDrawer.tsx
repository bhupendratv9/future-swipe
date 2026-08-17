import { Drawer } from "@base-ui/react";
import ShareCopyIconSvg from "@/components/svgs/icons/ShareCopyIconSVG.tsx";
import React from "react";
import FacebookIconSvg from "@/components/svgs/icons/FacebookIconSVG.tsx";
import InstagramIconSvg from "@/components/svgs/icons/InstagramIconSVG.tsx";
import WhatsAppIconSvg from "@/components/svgs/icons/WhatsAppIconSVG.tsx";
import GmailIconSvg from "@/components/svgs/icons/GmailIconSVG.tsx";
import {toast} from "sonner";

type Props = {
  trigger?: React.ReactNode;
  link?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ShareDrawer({
  trigger,
  link = "",
  open,
  onOpenChange,
}: Props) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Future Swipe by Education",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <WhatsAppIconSvg className="size-12" />,
    },
    {
      name: "Mail",
      icon: <GmailIconSvg className="size-12" />,
    },
    {
      name: "Facebook",
      icon: <FacebookIconSvg className="size-12" />,
    },
    {
      name: "Instagram",
      icon: <InstagramIconSvg className="size-10" />,
    },
    {
      name: "More",
      icon: (
        <button
          onClick={handleShare}
          className="size-12 bg-white flex items-center justify-center text-secondary rounded-full font-bold text-2xl cursor-pointer"
        >
          ...
        </button>
      ),
    },
  ];

  return (
    <Drawer.Root
      swipeDirection="down"
      open={open}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      {trigger && <Drawer.Trigger>{trigger}</Drawer.Trigger>}

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-all data-starting-style:opacity-0 data-ending-style:opacity-0" />

        <Drawer.Viewport className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50 flex flex-col focus:outline-none max-w-103 md:max-w-full w-full">
          <Drawer.Popup className="bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px rounded-t-[30px] lg:rounded-none shadow-xl transition-all duration-300 ease-out transform data-starting-style:translate-y-full data-ending-style:translate-y-full">
            {/* Content: Padding and the handle */}
            <Drawer.Content className="bg-black rounded-t-[30px] lg:rounded-none p-5 text-white font-montserrat ">
              {/* Visual Handle (Grabber) */}
              <div className="max-w-103 mx-auto">
                <div className="flex items-center justify-center">
                <Drawer.Close className="mx-auto mb-4 h-1 w-25 rounded-full bg-[#333333] cursor-pointer" />
              </div>

              <div className="space-y-5 mt-5">
                <p className="text-center font-medium">
                  Share with your friends
                </p>
                <div className="h-0.5 w-full rounded-full bg-[#333333]" />

                <button
                  onClick={() => {
                    if (!navigator.clipboard) {
                      toast.error("Clipboard access not available (requires HTTPS)");
                      return;
                    }

                    const textToCopy = link || window.location.href;
                    const copyPromise = navigator.clipboard.writeText(textToCopy);

                    toast.promise(copyPromise, {
                      loading: "Copying link...",
                      success: "Link copied to clipboard!",
                      error: "Failed to copy link",
                    });
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2.5 bg-white/10 rounded-full text-secondary cursor-pointer"
                >
                  <ShareCopyIconSvg />
                  <span className="text-sm font-light">Copy Link</span>
                </button>

                <p className="text-sm font-light text-wrap break-all">
                  {window.location.href ??"https//:Futureswipebyeducation9.com/game/dummylink"}
                </p>

                <div className="h-0.5 w-full rounded-full bg-[#333333]" />

                <div className="flex gap-3 items-center justify-center">
                  {shareLinks.map((link) => (
                    <button
                      key={link.name}
                      className="flex flex-col items-center justify-center gap-1.5 max-w-16 cursor-pointer p-1"
                    >
                      <div className="size-12 flex items-center justify-center">
                        {link.icon}
                      </div>
                      <p className="text-xs font-light text-wrap">
                        {link.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
