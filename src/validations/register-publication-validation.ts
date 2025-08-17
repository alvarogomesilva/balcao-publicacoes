import z from "zod";

export const registerPublicationValidation = z.object({
    name: z.string(),
    code: z.string()
})

export type RegisterPublication = z.infer<typeof registerPublicationValidation>