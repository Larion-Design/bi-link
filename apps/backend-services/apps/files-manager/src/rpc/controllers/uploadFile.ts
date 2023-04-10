import { MICROSERVICES } from '@app/rpc'
import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FileImporterService } from '../../files/services/fileImporterService'

type Params = Parameters<FilesManagerServiceMethods['uploadFile']>[0]
type Result = ReturnType<FilesManagerServiceMethods['uploadFile']> | undefined

@Controller()
export class UploadFile {
  constructor(private readonly fileImporterService: FileImporterService) {}

  @MessagePattern(MICROSERVICES.FILES_MANAGER.uploadFile)
  async uploadFile(@Payload() { content, mimeType }: Params): Promise<Result> {
    return this.fileImporterService.upsertFile(new Buffer(content, 'base64'), mimeType)
  }
}
