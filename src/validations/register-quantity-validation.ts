
import z from "zod";

export const registerQuantityValidation = z.object({
    quantity: z.number()
})

export type RegisterQuantity = z.infer<typeof registerQuantityValidation>