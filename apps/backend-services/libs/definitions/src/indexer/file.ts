import { File } from 'defs'

export type ProcessedFileIndex = {
  content: string
  processedDate: string | Date
}
export type EmbeddedFileIndex = Pick<File, 'name' | 'description'> & {
  content: string
}
