import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, "Product Id is required"),
    quantity: z.number().min(1).default(1),
  }),
});

export const updateQuantitySchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product Id route parameter is required"),
  }),
  body: z.object({
    quantity: z.number().min(0, "Quantity cannot be negative"), 
  }),
});
