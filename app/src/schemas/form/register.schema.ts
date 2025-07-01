import {z} from "zod";

const registerSchema = z
  .object({
    email: z.string().email({message: "Invalid email address"}),
    password: z
      .string()
      .min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z
      .string()
      .min(8, {message: "Confirm password must be at least 8 characters long"}),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
