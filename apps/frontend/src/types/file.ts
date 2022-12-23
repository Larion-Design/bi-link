export interface File {
  fileId: string
  name: string
  description: string
  isHidden: boolean
  url?: DownloadUrl | null
}

export interface DownloadUrl {
  url: string
  ttl: number
}

export type ProcessedFileIndex = {
  content: string
  processedDate: string | Date
}

export type EmbeddedFileIndex = Pick<File, 'name' | 'description'> & {
  content: string
}

export interface FileAPIOutput extends File {}
export interface FileAPIInput extends Readonly<Omit<File, 'url'>> {}

export const FileSources = {
  USER_UPLOAD: 'USER_UPLOAD',
}
