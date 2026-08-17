import { createFileRoute, redirect } from "@tanstack/react-router";
import { Vstack } from "@/components/layout/Vstack.tsx";
import { Container } from "@/components/layout/Container.tsx";
import { Field, Form, Radio, RadioGroup, Select } from "@base-ui/react";
import { motion } from "motion/react";
import profilePlaceholder from "@/assets/common/profile-placeholder.png";
import ReloadIconSvg from "@/components/svgs/icons/ReloadIconSVG.tsx";
import ProfileImageUploadIconSvg from "@/components/svgs/icons/ProfileImageUploadIconSVG.tsx";
import ProfileCancelIconSvg from "@/components/svgs/icons/ProfileCancelIconSVG.tsx";
import GradientAnimatedButton from "@/components/common/GradientAnimatedButton.tsx";
import { useUpdateProfileMutation } from "@/queries/mutations/update-profile-mutaion.ts";
import { useGetProfileQuery } from "@/queries/get-profile-query.ts";
import { useForm } from "@tanstack/react-form";
import {
  type ProfileFormValues,
  profileScheme,
} from "@/schemas/profile-schema.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { toast } from "sonner";
import { useEffect } from "react";
import { getProfile } from "@/api/services/get-profile.ts";
import { hardNavigateToAppPath, resolvePostAuthPath } from "@/lib/auth-redirect.ts";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { getAppLanguage } from "@/lib/getAppLanguage.ts";
import { getPageContent } from "@/api/services/get-page-content.ts";
import { useQuery } from "@tanstack/react-query";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/(auth)/complete-profile")({
  validateSearch: searchSchema,
  beforeLoad: async ({ search }) => {
    await queryClient.ensureQueryData({
      queryKey: ["signin", getAppLanguage()],
      queryFn: () => getPageContent("signin", getAppLanguage()),
    });

    const { data } = await queryClient.ensureQueryData({
      queryKey: ["profile"],
      queryFn: getProfile,
    });

    const user = data?.user ?? data;
    const isProfileComplete = Boolean(user?.age && user?.gender && user?.name);

    const targetPath = resolvePostAuthPath(search?.redirect, "/dashboard");

    if (isProfileComplete) {
      throw redirect({
        to: targetPath,
      });
    }
  },
  component: RouteComponent,
  loader: async () => {
    try {
      await queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getProfile,
      });
    } catch {
      return null;
    }
  },
});

const qualificationOptions = [
  { value: "class_10", label: "10th Pass" },
  { value: "class_12", label: "12th Pass" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
];

function RouteComponent() {
  const updateProfileMutation = useUpdateProfileMutation();

  const search = Route.useSearch();

  const { i18n } = useTranslation();

  const { data: pageData } = useQuery({
    queryKey: ["signin", i18n.language],
    queryFn: () => getPageContent("signin", getAppLanguage()),
  });

  const pageContent = pageData?.data;

  const genderOptions = [
    {
      value: "Male",
      label: pageContent?.personalInfo?.fields?.gender?.type.male,
    },
    {
      value: "Female",
      label: pageContent?.personalInfo?.fields?.gender?.type.female,
    },
  ];

  const targetPath = resolvePostAuthPath(search?.redirect, "/dashboard");

  const { data: buttonData } = useQuery({
    queryKey: ["button_page", i18n.language],
    queryFn: () => getPageContent("button_page", getAppLanguage()),
  });

  const buttonContent = buttonData?.data?.form;

  const { data } = useGetProfileQuery();

  const profileData = data?.data?.user;

  const form = useForm({
    defaultValues: {
      name: "",
      gender: "" as "Male" | "Female",
      age: 0,
      image: undefined,
      qualification: "",
    } as ProfileFormValues,
    validators: {
      onMount: profileScheme,
      onChange: profileScheme,
    },
    onSubmit: ({ value }) => {
      const formData = new FormData();

      // formData.append("type", "guest");
      formData.append("name", value.name);
      formData.append("gender", value.gender);
      formData.append("age", value.age.toString());
      formData.append("qualification", value.qualification);

      if (value.image && typeof value.image !== "string") {
        formData.append("image", value.image as File);
      }

      if (!value.image) {
        formData.append("image", "");
      }

      updateProfileMutation.mutate(formData, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["profile"] });
          await queryClient.refetchQueries({ queryKey: ["profile"] });
          form.reset();
          hardNavigateToAppPath(targetPath);
          toast.success("Profile updated successfully");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again later.");
        },
      });
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        gender:
          (profileData.gender as "Male" | "Female") ||
          ("" as "Male" | "Female"),
        age: Number(profileData.age) || 0,
        image: profileData.image || undefined,
        qualification: profileData.qualification || "",
      });
    }
  }, [profileData]);
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.8, 0, 0.6, 1] }}
    >
      <Vstack size="sm">
        <Container className="max-w-120">
          <div className="max-w-91 mx-auto">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className={
                "space-y-10 min-h-[calc(100vh-20vh)] flex items-center justify-center font-montserrat"
              }
            >
              <motion.div
                initial={{ y: 600, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
                className="space-y-10"
              >
                <div className="px-4 space-y-10">
                  <div className="space-y-10">
                    <div className={"space-y-6"}>
                      <form.Field name="image">
                        {(field) => {
                          return (
                            <div className="flex items-center gap-2.5">
                              <div className="size-20 min-w-20 rounded-full overflow-hidden">
                                {field.state.value ? (
                                  <img
                                    src={
                                      typeof field.state.value === "string"
                                        ? field.state.value
                                        : URL.createObjectURL(
                                            field.state.value as Blob,
                                          )
                                    }
                                    className="size-full object-cover"
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    src={profilePlaceholder}
                                    alt=""
                                    className="size-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex items-center justify-center w-full gap-2.5">
                                <Field.Control
                                  id="profile-picture-image"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onClick={(e) => {
                                    (e.target as HTMLInputElement).value = "";
                                  }}
                                  onChange={(e) =>
                                    field.handleChange(e?.target?.files?.[0])
                                  }
                                />
                                <label
                                  htmlFor="profile-picture-image"
                                  className="cursor-pointer"
                                >
                                  {field.state.value ? (
                                    <div className="flex bg-white/10 px-5 py-3.75 items-center text-[13px] rounded-full gap-2.5 font-semibold text-[#8D8D8D]">
                                      <ReloadIconSvg />
                                      <span>
                                        {
                                          pageContent?.personalInfo.fields
                                            .upload.change
                                        }
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex bg-white/10 px-5 py-3.75 items-center text-[13px] text-secondary rounded-full gap-2.5 font-semibold">
                                      <ProfileImageUploadIconSvg />
                                      <span>
                                        {
                                          pageContent?.personalInfo.fields
                                            .upload.placeholder
                                        }
                                      </span>
                                    </div>
                                  )}
                                </label>
                                <>
                                  {field?.state?.value && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        field.handleChange(undefined);
                                      }}
                                      className="flex cursor-pointer bg-white/10 px-5 py-3.75 items-center text-[13px] rounded-full gap-2.5 font-semibold text-[#8D8D8D]"
                                    >
                                      <ProfileCancelIconSvg />
                                    </button>
                                  )}
                                </>
                              </div>
                            </div>
                          );
                        }}
                      </form.Field>

                      <form.Field name="name">
                        {(field) => {
                          const hasError =
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0;
                          return (
                            <Field.Root
                              invalid={hasError}
                              className={"flex flex-col gap-2.5"}
                            >
                              <Field.Label
                                className={"font-medium text-white/30 text-sm"}
                              >
                                {pageContent?.personalInfo.fields.name.label}
                              </Field.Label>
                              <Field.Control
                                type="text"
                                className={
                                  "bg-white/20 rounded-[10px] p-2.5 pl-3.5 h-12.5 text-[15px]"
                                }
                                placeholder="Enter your name"
                                value={(field?.state?.value as string) ?? ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                              />

                              {hasError && (
                                <Field.Error
                                  match={
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid
                                  }
                                  className={"text-[#D26A5C] text-sm"}
                                >
                                  {field.state.meta.errors[0]?.message}
                                </Field.Error>
                              )}
                            </Field.Root>
                          );
                        }}
                      </form.Field>

                      <form.Field name="gender">
                        {(field) => {
                          const hasError =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field.Root
                              invalid={hasError}
                              dirty={field.state.meta.isDirty}
                              touched={field.state.meta.isTouched}
                              className="flex flex-col gap-2.5"
                            >
                              <Field.Label className="font-medium text-white/30 text-sm">
                                {pageContent?.personalInfo.fields.gender.label}
                              </Field.Label>
                              <RadioGroup
                                value={field.state.value as string}
                                onValueChange={(value) =>
                                  field.handleChange(value as "Male" | "Female")
                                }
                                onBlur={field.handleBlur}
                                className="flex gap-3"
                              >
                                {genderOptions.map((option) => (
                                  <label
                                    key={option.value}
                                    className="flex items-center gap-2.5 p-2.5 pl-3.5 rounded-full cursor-pointer"
                                  >
                                    <Radio.Root
                                      value={option.value}
                                      className="size-4 rounded-full border-3 border-white bg-white/10 flex items-center justify-center data-checked:border data-checked:border-secondary data-checked:bg-secondary/20"
                                    >
                                      <Radio.Indicator className="size-2.75 rounded-full bg-secondary" />
                                    </Radio.Root>
                                    <span className="text-[13px] font-semibold text-white/70">
                                      {option.label}
                                    </span>
                                  </label>
                                ))}
                              </RadioGroup>
                              <Field.Error
                                match={hasError}
                                className="text-[#D26A5C] text-sm"
                              >
                                {field.state.meta.errors[0]?.message}
                              </Field.Error>
                            </Field.Root>
                          );
                        }}
                      </form.Field>

                      <form.Field name="age">
                        {(field) => {
                          const hasError =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field.Root
                              invalid={hasError}
                              dirty={field.state.meta.isDirty}
                              touched={field.state.meta.isTouched}
                              className="flex flex-col gap-2.5"
                            >
                              <Field.Label className="font-medium text-white/30 text-sm">
                                {pageContent?.personalInfo.fields.age.label}
                              </Field.Label>
                              <Field.Control
                                type="number"
                                className="bg-white/20 rounded-[10px] p-2.5 pl-3.5 h-12.5 text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder={
                                  pageContent?.personalInfo.fields.age
                                    .placeholder
                                }
                                value={
                                  field.state.value === 0
                                    ? ""
                                    : String(field.state.value)
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  field.handleChange(
                                    val === "" ? 0 : Number(val),
                                  );
                                }}
                                onBlur={field.handleBlur}
                              />
                              {hasError && (
                                <Field.Error
                                  match={hasError}
                                  className={"text-[#D26A5C] text-sm"}
                                >
                                  {field.state.meta.errors[0]?.message}
                                </Field.Error>
                              )}
                            </Field.Root>
                          );
                        }}
                      </form.Field>

                      <form.Field name="qualification">
                        {(field) => {
                          const hasError =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field.Root
                              invalid={hasError}
                              dirty={field.state.meta.isDirty}
                              touched={field.state.meta.isTouched}
                              className="flex flex-col gap-2.5"
                            >
                              <Field.Label className="font-medium text-white/30 text-sm">
                                {
                                  pageContent?.personalInfo.fields.qualification
                                    .label
                                }
                              </Field.Label>
                              <Select.Root
                                value={field.state.value as string}
                                onValueChange={(value) =>
                                  field.handleChange(value as string)
                                }
                                onOpenChange={() => field.handleBlur()}
                              >
                                <Select.Trigger className="flex items-center justify-between bg-white/20 rounded-[10px] px-3.5 h-12.5 text-[15px] w-full cursor-pointer">
                                  <Select.Value
                                    placeholder={
                                      pageContent?.personalInfo.fields
                                        .qualification.placeholder
                                    }
                                    className="data-placeholder:text-white/50"
                                  >
                                    {
                                      qualificationOptions.find(
                                        (item) =>
                                          item.value === field.state.value,
                                      )?.label
                                    }
                                  </Select.Value>
                                  <Select.Icon>
                                    <svg
                                      width="8"
                                      height="12"
                                      viewBox="0 0 8 12"
                                      fill="none"
                                      stroke="currentcolor"
                                      strokeWidth="1.5"
                                    >
                                      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
                                      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
                                    </svg>
                                  </Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                  <Select.Positioner
                                    sideOffset={0}
                                    align="start"
                                    className={
                                      "z-50 rounded-[10px] bg-linear-to-b" +
                                      " from-secondary/40 via-[#5CE1E6]/40 to-[#5CE1E6]/10 p-px"
                                    }
                                  >
                                    <Select.Popup className="bg-black rounded-[10px]">
                                      <Select.List
                                        className={
                                          "rounded-[10px] p-1 bg-linear-to-b from-secondary/6 to-[#5CE1E6]/6"
                                        }
                                      >
                                        {qualificationOptions.map(
                                          ({ label, value }) => (
                                            <Select.Item
                                              key={value}
                                              value={value}
                                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-white/10 data-highlighted:bg-white/10 data-selected:text-white data-selected:font-semibold"
                                            >
                                              <Select.ItemIndicator className="text-secondary">
                                                <svg
                                                  fill="currentcolor"
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                >
                                                  <path d="M9.1.7L3.5 8.1 1 5.5.3 6.2l3.2 3.2 6.2-8-.6-.7z" />
                                                </svg>
                                              </Select.ItemIndicator>
                                              <Select.ItemText>
                                                {label}
                                              </Select.ItemText>
                                            </Select.Item>
                                          ),
                                        )}
                                      </Select.List>
                                    </Select.Popup>
                                  </Select.Positioner>
                                </Select.Portal>
                              </Select.Root>
                              {hasError && (
                                <Field.Error
                                  match={hasError}
                                  className="text-[#D26A5C] text-sm"
                                >
                                  {field.state.meta.errors[0]?.message}
                                </Field.Error>
                              )}
                            </Field.Root>
                          );
                        }}
                      </form.Field>
                    </div>
                  </div>
                </div>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => {
                    return (
                      <GradientAnimatedButton
                        disabled={!canSubmit}
                        type="submit"
                        onClick={() => form.handleSubmit()}
                        buttonText={
                          isSubmitting || updateProfileMutation.isPending
                            ? buttonContent?.submitting
                            : buttonContent?.submit
                        }
                      />
                    );
                  }}
                </form.Subscribe>
              </motion.div>
            </Form>
          </div>
        </Container>
      </Vstack>
    </motion.main>
  );
}
