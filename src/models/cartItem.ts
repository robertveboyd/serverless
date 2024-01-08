import { z } from "zod";

export const CartItemSchema = z.object({
  CustomerId: z.string(),
  ProductName: z.string(),
  AddedToCartDate: z.string(),
});

export const CartItemsSchema = z.array(CartItemSchema);

export type CartItem = z.infer<typeof CartItemSchema>;
export type CartItems = z.infer<typeof CartItemsSchema>;
