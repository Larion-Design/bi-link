import { Model, ProjectionFields } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name)

  constructor(@InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>) {}

  getFile = async (fileId: string) => {
    try {
      return this.fileModel.findOne({ fileId }).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getFiles = async (filesIds: string[]) => {
    try {
      return this.fileModel.find({ fileId: filesIds }).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  async *getAllFiles(fields: ProjectionFields<FileDocument> = { _id: 1 }) {
    for await (const fileDocument of this.fileModel.find({}, fields)) {
      yield fileDocument
    }
  }
}
