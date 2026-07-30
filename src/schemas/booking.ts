import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  notes: z.string().max(500, "Keep notes under 500 characters.").optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
