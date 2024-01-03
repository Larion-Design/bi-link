import { FilesService } from '@modules/central/schema/file/services/filesService'
import { Injectable } from '@nestjs/common'
import { extension as mimeTypeToExtension } from 'mime-types'
import { createHash } from 'node:crypto'
import { FileStorageService } from './fileStorageService'

@Injectable()
export class FileImporterService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly filesService: FilesService,
  ) {}

  async upsertFile(buffer: Buffer, mimeType: string) {
    const hash = this.getFileContentHash(buffer)
    const fileDocument = await this.filesService.getFileDocumentByHash(hash)

    if (fileDocument) {
      return { fileId: fileDocument.fileId, created: false, hash }
    }

    const newFileId = await this.uploadNewFile(buffer, mimeType, hash)

    if (newFileId) {
      return { fileId: newFileId, created: true, hash }
    }
  }

  private uploadNewFile = async (content: Buffer, mimeType: string, hash: string) => {
    const fileId = this.getFileId(mimeType, hash)

    if (await this.fileStorageService.uploadFile(fileId, content)) {
      return fileId
    }
  }

  private getFileContentHash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex')

  private getFileId = (mimeType: string, hash: string) => {
    const extension = mimeTypeToExtension(mimeType)
    return `${hash}${!extension ? '' : `.${extension}`}`
  }
}
