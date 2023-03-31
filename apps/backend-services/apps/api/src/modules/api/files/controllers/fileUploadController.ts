import { GlobalEventsService } from '@app/rpc/microservices/globalEvents/globalEventsService'
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileImporterService } from '@app/files/services/fileImporterService'
import { FileAPIInput } from 'defs'

@Controller()
export class FileUploadController {
  constructor(
    private readonly fileImporterService: FileImporterService,
    private readonly globalEventsService: GlobalEventsService,
  ) {}

  @Post('fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileAPIInput | void> {
    if (file) {
      const result = await this.fileImporterService.getFileDocumentFromBuffer(
        file.buffer,
        file.mimetype,
      )

      if (result) {
        const { fileDocument, created } = result

        if (fileDocument?.fileId) {
          if (created) {
            this.globalEventsService.dispatchEntityCreated({
              entityType: 'FILE',
              entityId: fileDocument.fileId,
            })
          }
          return fileDocument
        }
      }
    }
  }
}
