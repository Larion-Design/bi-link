import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model } from 'mongoose'
import { FileAPIInput } from 'defs'
import { FileDocument, FileModel } from '../models/fileModel'

@Injectable()
export class FileAPIService {
  private readonly logger = new Logger(FileAPIService.name)

  constructor(@InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>) {}

  getUploadedFileModel = async (fileInfo: FileAPIInput, session?: ClientSession) => {
    try {
      const fileModel = new FileModel()
      fileModel.fileId = fileInfo.fileId
      fileModel.name = fileInfo.name
      fileModel.description = fileInfo.description
      fileModel.isHidden = !!fileInfo.isHidden
      fileModel.metadata = fileInfo.metadata

      return this.fileModel.findOneAndUpdate<FileModel>({ fileId: fileInfo.fileId }, fileModel, {
        new: true,
        upsert: true,
        session,
      })
    } catch (e) {
      this.logger.error(e)
    }
  }

  getUploadedFilesModels = async (files: FileAPIInput[]) => {
    try {
      const transactionSession = await this.fileModel.startSession()
      const fileModels = await Promise.all(
        files.map(async (fileInfo) => this.getUploadedFileModel(fileInfo, transactionSession)),
      )
      await transactionSession.endSession()
      return fileModels.filter((fileModel) => !!fileModel)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
