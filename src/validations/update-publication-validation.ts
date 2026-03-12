import z from "zod";

export const updatePublicationValidation = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
});

export type UpdatePublication = z.infer<typeof updatePublicationValidation>;
