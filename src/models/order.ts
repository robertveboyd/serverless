import { z } from "zod";

export const OrderSchema = z.object({
  CustomerId: z.string(),
  OrderDate: z.string(),
  Products: z.array(
    z.object({
      ProductName: z.string(),
    })
  ),
});

export const OrdersSchema = z.array(OrderSchema);

export type Order = z.infer<typeof OrderSchema>;
export type Orders = z.infer<typeof OrdersSchema>;
