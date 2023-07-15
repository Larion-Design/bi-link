import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'
import { Injectable } from '@nestjs/common'
import { extension as mimeTypeToExtension } from 'mime-types'
import { createHash } from 'node:crypto'
import { IngressService } from '@app/rpc/microservices/ingress'
import { FileStorageService } from './fileStorageService'

type Result = Promise<ReturnType<FilesManagerServiceMethods['uploadFile']> | undefined>

@Injectable()
export class FileImporterService {
  constructor(
    private readonly ingressService: IngressService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async upsertFile(buffer: Buffer, mimeType: string): Result {
    const hash = this.getFileContentHash(buffer)
    const fileDocument = await this.getFileDocumentByHash(hash)

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

  private getFileDocumentByHash = (hash: string) => this.ingressService.getFileByHash(hash)

  private getFileContentHash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex')

  private getFileId = (mimeType: string, hash: string) => {
    const extension = mimeTypeToExtension(mimeType)
    return `${hash}${!extension ? '' : `.${extension}`}`
  }
}
