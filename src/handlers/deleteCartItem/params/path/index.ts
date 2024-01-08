import { z } from "zod";

export const DeleteCartItemPathParamsSchema = z.object({
  productName: z.string(),
});

export type DeleteCartItemPathParams = z.infer<
  typeof DeleteCartItemPathParamsSchema
>;
