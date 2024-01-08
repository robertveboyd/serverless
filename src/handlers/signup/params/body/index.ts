import { z } from "zod";

export const SignupBodyParamsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupBodyParams = z.infer<typeof SignupBodyParamsSchema>;
