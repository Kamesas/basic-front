import z from "zod";

export const schemaRegister = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.email("invalid email format").optional(),
  displayname: z
    .string()
    .min(1, "display name cannot be empty")
    .max(100, "Display name must be at most 100 characters")
    .optional(),
});
