import z from "zod";

export const registerQuantityValidation = z.object({
  quantity: z
    .number({ error: "Informe uma quantidade válida." })
    .int("Informe uma quantidade inteira.")
    .positive("A quantidade precisa ser maior que zero."),
});

export type RegisterQuantity = z.infer<typeof registerQuantityValidation>;
