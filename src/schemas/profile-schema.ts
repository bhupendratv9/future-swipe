import { z } from "zod";

// Image File Schema: strict
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i;

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, { message: "File must not be empty" })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only JPEG, JPG, PNG, WebP files are allowed",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size should not exceed 2MB",
  })
  .refine((file) => ACCEPTED_EXTENSIONS.test(file.name), {
    message: "Invalid file extension",
  });

// Name Schema: strict
const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(100, { message: "Name must be at most 100 characters" })
  .regex(/^[A-Za-z][A-Za-z\s'-]*[A-Za-z]$/, {
    message:
      "Name must only contain letters, spaces, apostrophes, or hyphens, and must start and end with a letter",
  });

// Combined schema
export const profileScheme = z.object({
  image: imageFileSchema.optional().or(z.string().optional()),
  name: nameSchema,
  gender: z.enum(["Male", "Female"], { message: "Please select a gender" }),
  age: z
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(120, "Please enter a valid age"),
  qualification: z.string(),
});

export const guestSchema = z.object({
  image: imageFileSchema.optional(),
  name: nameSchema,
  gender: z.enum(["Male", "Female"], { message: "Please select a gender" }),
  age: z
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(120, "Please enter a valid age"),
  // qualification: z.string(),
})

export type ProfileFormValues = z.infer<typeof profileScheme>;

export type GuestFormValues = z.infer<typeof guestSchema>;
