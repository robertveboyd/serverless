import { z } from "zod";

export const LoginBodyParamsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginBodyParams = z.infer<typeof LoginBodyParamsSchema>;
