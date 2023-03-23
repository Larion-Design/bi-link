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

export interface FileAPIOutput extends File {
  mimeType: string
}
export interface FileAPIInput extends Readonly<Omit<File, 'url'>> {}

export const FileSources = {
  USER_UPLOAD: 'USER_UPLOAD',
}
