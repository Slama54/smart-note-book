import { z } from "zod";
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
