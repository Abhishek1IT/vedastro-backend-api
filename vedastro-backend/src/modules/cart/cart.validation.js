import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product Id is required"),
  quantity: z.number().min(1).default(1),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});