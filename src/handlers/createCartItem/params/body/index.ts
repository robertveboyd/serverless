import { z } from "zod";

export const CreateCartItemBodyParamsSchema = z.object({
  productName: z.string(),
});

export type CreateCartItemBodyParams = z.infer<
  typeof CreateCartItemBodyParamsSchema
>;
