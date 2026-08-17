import { Drawer, Field, Form } from "@base-ui/react";
import React, { useEffect, useState } from "react";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton.tsx";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { OTPInput, OTPSlot } from "@/components/form/input-otp.tsx";
import { useDeleteAccountMutation } from "@/queries/mutations/delete-account-mutation.ts";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { queryClient } from "@/lib/queryClient.ts";
import { useTranslation } from "react-i18next";
import { useSwipeStore } from "@/store/swipeStore.ts";
import {useQuery} from "@tanstack/react-query";
import {getPageContent} from "@/api/services/get-page-content.ts";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";
// import {useHotkey} from "@tanstack/react-hotkeys";

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const otpSchema = z.object({
  confirm: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers"),
});

export default function DeleteAccountDrawer({
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [step, setStep] = useState(0);

  const router = useRouter();

  const { i18n } = useTranslation();

  const deleteAccountMutation = useDeleteAccountMutation();
  const setSessionId = useSwipeStore((state) => state.setSessionId);

  const { data } = useQuery({
    queryKey: ["profile_page", i18n.language],
    queryFn: () => getPageContent("profile_page", getAppLanguage()),
  });

  const deleteDrawerData = data?.data?.menu?.delete;

  useEffect(() => {
    setTimeout(() => {
      if (!open) setStep(0);
    }, 300);
  }, [open]);

  const form = useForm({
    defaultValues: {
      confirm: "",
    },
    validators: {
      onChange: otpSchema,
      onMount: otpSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      formData.append("confirm", value.confirm.toUpperCase());

      deleteAccountMutation.mutate(formData, {
        onSuccess: () => {
          toast.success(deleteDrawerData?.message?.text);
          onOpenChange?.(false);
          setSessionId("");
          queryClient.removeQueries({ queryKey: ["profile"] });
          form.reset();
          setStep(0);
          router.navigate({
            to: "/dashboard",
          });
        },
        onError: () => {
          toast.error("Something went wrong. Please try again later.");
        },
      });
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      if (step === 0) {
        setStep(1);
      } else if (step === 1) {
        form.handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, form]);

  return (
    <Drawer.Root
      swipeDirection="down"
      open={open}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      <Drawer.Trigger className={"w-full"}>{trigger}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-all data-starting-style:opacity-0 data-ending-style:opacity-0" />

        <Drawer.Viewport className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50 flex flex-col focus:outline-none max-w-103 md:max-w-160 w-full">
          <Drawer.Popup className="bg-linear-to-b from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px rounded-t-[30px] shadow-xl transition-all duration-300 ease-out transform data-starting-style:translate-y-full data-ending-style:translate-y-full">
            {/* Content: Padding and the handle */}
            <Drawer.Content className="bg-black rounded-t-[30px] p-5 text-white font-montserrat w-full">
              {/* Visual Handle (Grabber) */}
              {step === 0 && (
                <div className="space-y-10">
                  <div className="space-y-3.5 text-center">
                    <p className="h2">{deleteDrawerData?.pageHeading}</p>
                    <p className="p-medium-2">{deleteDrawerData?.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        onOpenChange ? onOpenChange(false) : undefined
                      }
                      className="bg-[#A3A3A3] py-3.75 px-5 rounded-full text-black font-medium cursor-pointer"
                    >
                      {deleteDrawerData?.button.cancel}
                    </button>
                    <GradientAnimatedButton
                      buttonText={deleteDrawerData?.button.delete}
                      varient="delete"
                      textClassName="text-base font-medium"
                      onClick={() => setStep(1)}
                    />
                  </div>
                </div>
              )}
              {step === 1 && (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit().then(() => {});
                  }}
                >
                  <div className="space-y-10">
                    <div className="space-y-3.5 text-center">
                      <p className="h2">{deleteDrawerData?.account.title}</p>
                      <p className="p-medium-2">
                        {deleteDrawerData?.account.subTitle}
                      </p>
                    </div>
                    <div className="space-y-3.5">
                      <p className="text-white/30 p-medium-2 font-medium text-center">
                        Type <span className="text-white">DELETE</span> to
                        Confirm
                      </p>

                      <div className="flex justify-center">
                        <form.Field name="confirm">
                          {(field) => {
                            return (
                              <Field.Root name={field.name}>
                                <OTPInput
                                  value={field.state.value}
                                  onChange={(v) => field.handleChange(v)}
                                >
                                  {Array.from({ length: 6 }, (_, i) => (
                                    <OTPSlot key={i} index={i} />
                                  ))}
                                </OTPInput>
                              </Field.Root>
                            );
                          }}
                        </form.Field>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setStep(0);
                        }}
                        className="bg-[#A3A3A3] py-3.75 px-5 rounded-full text-black font-medium cursor-pointer"
                      >
                        {deleteDrawerData?.account.button.back}
                      </button>

                      {
                        <form.Subscribe selector={(state) => [state.canSubmit]}>
                          {([canSubmit]) => {
                            return (
                              <GradientAnimatedButton
                                buttonText={deleteDrawerData?.account.button.delete}
                                textClassName="text-base font-medium"
                                type="submit"
                                disabled={!canSubmit}
                                onClick={() => {
                                  form.handleSubmit();
                                }}
                              />
                            );
                          }}
                        </form.Subscribe>
                      }
                    </div>
                  </div>
                </Form>
              )}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
