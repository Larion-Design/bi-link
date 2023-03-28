import { Injectable, Logger } from '@nestjs/common'
import { Model } from 'mongoose'
import { createHash } from 'node:crypto'
import { InjectModel } from '@nestjs/mongoose'
import { FileDocument, FileModel } from '@app/models/file/models/fileModel'
import { FileSources } from 'defs'
import { FileStorageService } from '@app/files/services/fileStorageService'

@Injectable()
export class FileImporterService {
  private readonly logger = new Logger(FileImporterService.name)

  constructor(
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  getFileDocumentFromBuffer = async (buffer: Buffer, mimeType: string) => {
    const hash = this.getFileContentHash(buffer)
    const fileDocument = await this.getFileDocumentByHash(hash)

    if (fileDocument) {
      return { fileDocument, created: false }
    }

    const fileId = this.fileStorageService.getFileId(mimeType, hash)

    if (await this.fileStorageService.uploadFile(fileId, buffer)) {
      const newFileDocument = await this.createNewFileDocument(fileId, mimeType, hash)
      return { fileDocument: newFileDocument, created: true }
    }
  }

  private getFileContentHash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex')

  private getFileDocumentByHash = async (hash: string) => {
    try {
      return this.fileModel.findOne({ hash }).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  private createNewFileDocument = async (fileId: string, mimeType: string, hash: string) => {
    const fileModel = new FileModel()
    fileModel.fileId = fileId
    fileModel.hash = hash
    fileModel.mimeType = mimeType
    fileModel.name = ''
    fileModel.description = ''
    fileModel.isHidden = false
    fileModel.source = FileSources.USER_UPLOAD
    return this.fileModel.create(fileModel)
  }
}
