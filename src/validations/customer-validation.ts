import z from "zod";

export const customerValidation = z.object({
  name: z.string().trim().min(2, "Informe o nome completo."),
  email: z
    .string()
    .trim()
    .refine((value) => !value || z.email().safeParse(value).success, "Informe um email valido."),
  phone: z.string().trim().min(8, "Informe um telefone valido."),
  city: z.string().trim().min(2, "Informe a cidade."),
  notes: z.string().trim(),
  active: z.boolean(),
});

export type CustomerForm = z.infer<typeof customerValidation>;
