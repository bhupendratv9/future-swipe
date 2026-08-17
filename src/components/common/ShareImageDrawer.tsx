import { Drawer } from "@base-ui/react";
// import { toast } from "sonner";
// import ShareCopyIconSvg from "@/components/svgs/icons/ShareCopyIconSVG.tsx";
import WhatsAppIconSvg from "@/components/svgs/icons/WhatsAppIconSVG.tsx";
import GmailIconSvg from "@/components/svgs/icons/GmailIconSVG.tsx";
import FacebookIconSvg from "@/components/svgs/icons/FacebookIconSVG.tsx";
import InstagramIconSvg from "@/components/svgs/icons/InstagramIconSVG.tsx";
import React from "react";
import GenerateImage,{type GenerateImageRef} from "@/components/custom/insight/GenerateImage.tsx";

type Props = {
  trigger?: React.ReactNode;
  link?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ShareImageDrawer({
  trigger,
  open,
  onOpenChange,
}: Props) {

  const generateRef = React.useRef<GenerateImageRef>(null);

  const handleShare = async () => {
    if (navigator.share) {
      const dataUrl = await generateRef.current?.generateImage();

      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "result.png", { type: blob.type });

      const text = `Check out my result!`

      await navigator.share({
        files: [file],
        text: text,
        title: "My Result",
        url: import.meta.env.VITE_BASE_URL,
      });
    } else {
      await navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL);
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
      <Drawer.Trigger>{trigger}</Drawer.Trigger>

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

                <div className="space-y-5">
                  <div className="flex justify-center">
                    <GenerateImage ref={generateRef}/>
                  </div>

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
