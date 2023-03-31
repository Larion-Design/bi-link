import { z } from 'zod'

export const filesParserInterfaceSchema = z.object({
  extractText: z.function().args(z.string().nonempty()).returns(z.string()),
})

export type FilesParserServiceMethods = z.infer<typeof filesParserInterfaceSchema>
