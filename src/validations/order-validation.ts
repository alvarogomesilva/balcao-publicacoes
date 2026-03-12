import z from "zod";

const orderItemValidation = z.object({
  publicationId: z.string().min(1, "Selecione uma publicacao."),
  publicationCollection: z.enum(["books", "awaken", "sentinels", "others"]),
  publicationName: z.string().min(1, "Selecione uma publicacao."),
  quantity: z
    .number({ error: "Informe uma quantidade valida." })
    .int("Use apenas numeros inteiros.")
    .positive("A quantidade deve ser maior que zero."),
  unitPrice: z
    .number({ error: "Informe um valor valido." })
    .min(0, "O valor nao pode ser negativo."),
});

export const orderValidation = z.object({
  customerId: z.string().min(1, "Selecione um cliente."),
  customerName: z.string().min(1, "Selecione um cliente."),
  notes: z.string().trim(),
  items: z.array(orderItemValidation).min(1, "Adicione ao menos um item."),
});

export type OrderForm = z.infer<typeof orderValidation>;
