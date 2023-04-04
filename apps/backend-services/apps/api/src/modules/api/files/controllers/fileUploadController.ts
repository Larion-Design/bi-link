import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesManagerService } from '@app/rpc/microservices/filesManager/filesManagerService'
import { IngressService } from '@app/rpc/microservices/ingress'
import { FileAPIInput, File } from 'defs'

@Controller()
export class FileUploadController {
  constructor(
    private readonly filesManagerService: FilesManagerService,
    private readonly ingressService: IngressService,
  ) {}

  @Post('fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileAPIInput | void> {
    if (file?.size) {
      const { originalname, buffer, mimetype } = file
      const uploadedFile = await this.filesManagerService.uploadFile(buffer, mimetype)

      if (uploadedFile) {
        const fileModel: File = {
          fileId: uploadedFile.fileId,
          hash: uploadedFile.hash,
          name: originalname,
          description: '',
          mimeType: mimetype,
          isHidden: false,
          metadata: {
            access: '',
            confirmed: true,
            trustworthiness: {
              source: '',
              level: 0,
            },
          },
        }

        await this.ingressService.createEntity('FILE', fileModel, {
          type: 'SERVICE',
          sourceId: 'SERVICE_API',
        })
        return fileModel
      }
    }
  }
}
