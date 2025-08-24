import z from "zod";

export const registerPublicationValidation = z.object({
    active: z.boolean(),
    name: z.string().min(1, "Nome é obrigatório"),
    code: z.string(),
    category: z.enum(['livros', 'sentinelas', 'despertais', 'outros'], { message: 'Selecione um tipo' })
})

export type RegisterPublication = z.infer<typeof registerPublicationValidation>