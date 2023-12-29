import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from '@modules/central/schema/file/services/filesService'

import { FileAPIInput, File } from 'defs'
import { getDefaultFile } from 'default-values'
import { FileImporterService } from '../../../../files/services/fileImporterService'

@Controller()
export class FileUploadController {
  constructor(
    private readonly filesManagerService: FileImporterService,
    private readonly ingressService: FilesService,
  ) {}

  @Post('fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileAPIInput | void> {
    if (file?.size) {
      const { originalname, buffer, mimetype } = file
      const uploadedFile = await this.filesManagerService.upsertFile(buffer, mimetype)

      if (uploadedFile) {
        const fileModel: File = {
          ...getDefaultFile(uploadedFile.fileId),
          hash: uploadedFile.hash,
          name: originalname,
          mimeType: mimetype,
        }

        await this.ingressService.create(fileModel)
        return fileModel
      }
    }
  }
}
