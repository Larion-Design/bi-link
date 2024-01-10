import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from '@modules/central/schema/file/services/filesService'
import { FileAPIInput, File } from 'defs'
import { getDefaultFile } from 'default-values'
import { FileImporterService } from '@modules/files/services/file-importer.service'

@Controller()
export class FileUploadController {
  constructor(
    private readonly filesManagerService: FileImporterService,
    private readonly filesService: FilesService,
  ) {}

  @Post('file-upload')
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

        if (uploadedFile.created) {
          await this.filesService.create(fileModel)
        }
        return fileModel
      }
    }
  }
}
