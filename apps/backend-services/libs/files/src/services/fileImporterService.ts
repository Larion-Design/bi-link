import { Injectable } from '@nestjs/common'
import { FileAPIInput } from 'defs'
import { createHash } from 'node:crypto'
import { IngressService } from '@app/rpc/microservices/ingress'
import { FileStorageService } from '@app/files/services/fileStorageService'

@Injectable()
export class FileImporterService {
  constructor(
    private readonly ingressService: IngressService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  getFileDocumentFromBuffer = async (buffer: Buffer, mimeType: string) => {
    const hash = this.getFileContentHash(buffer)
    const fileDocument = (await this.getFileDocumentByHash(hash)) as FileAPIInput

    if (fileDocument) {
      return { fileDocument, created: false }
    }

    const fileId = this.fileStorageService.getFileId(mimeType, hash)

    if (await this.fileStorageService.uploadFile(fileId, buffer)) {
      const newFileDocument = await this.createNewFileDocument(fileId, mimeType, hash)

      if (newFileDocument) {
        const fileDocument = await this.ingressService.getEntity(
          { entityType: 'FILE', entityId: newFileDocument },
          false,
          {
            sourceId: '',
            type: 'SERVICE',
          },
        )
        return { fileDocument, created: true }
      }
    }
  }

  private getFileDocumentByHash = (hash: string) => this.ingressService.getFileByHash(hash)

  private getFileContentHash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex')

  private createNewFileDocument = async (fileId: string, mimeType: string, hash: string) =>
    this.ingressService.createEntity(
      'FILE',
      {
        metadata: {
          access: '',
          confirmed: false,
          trustworthiness: {
            source: '',
            level: 0,
          },
        },
        fileId,
        hash,
        mimeType,
        name: '',
        description: '',
        isHidden: false,
      },
      {
        sourceId: '',
        type: 'SERVICE',
      },
    )
}
