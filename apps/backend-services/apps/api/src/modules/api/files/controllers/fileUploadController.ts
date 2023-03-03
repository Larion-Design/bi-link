import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { FileImporterService } from '@app/files/services/fileImporterService'

@Controller()
export class FileUploadController {
  constructor(
    private readonly fileImporterService: FileImporterService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Post('fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const { fileDocument, created } = await this.fileImporterService.getFileDocumentFromBuffer(
        file.buffer,
        file.mimetype,
      )

      const { fileId, name, description } = fileDocument

      if (created) {
        this.entityEventsService.emitEntityCreated({
          entityType: 'FILE',
          entityId: fileId,
        })
      }

      return {
        fileId,
        name: name.length ? name : file.originalname,
        description,
        isHidden: false,
      }
    }
  }
}
