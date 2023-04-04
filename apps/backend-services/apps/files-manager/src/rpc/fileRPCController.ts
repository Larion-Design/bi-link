import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc'
import { FileImporterService } from '../services/fileImporterService'
import { FileStorageService } from '../services/fileStorageService'

@Controller()
export class FileRPCController {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly fileImporterService: FileImporterService,
  ) {}

  @MessagePattern(MICROSERVICES.FILES_MANAGER.getFileContent)
  async getFileContent(@Payload() fileId: string) {
    const contentBuffer = await this.fileStorageService.getFileContent(fileId)

    if (contentBuffer) {
      return contentBuffer.toString('base64')
    }
  }

  @MessagePattern(MICROSERVICES.FILES_MANAGER.getFileContent)
  async uploadFile(
    @Payload() { content, mimeType }: Parameters<FilesManagerServiceMethods['uploadFile']>[0],
  ) {
    return this.fileImporterService.upsertFile(new Buffer(content, 'base64'), mimeType)
  }

  @MessagePattern(MICROSERVICES.FILES_MANAGER.getFileDownloadUrl)
  async getFileDownloadUrl(
    @Payload() { fileId, ttl }: Parameters<FilesManagerServiceMethods['getFileDownloadUrl']>[0],
  ) {
    return this.fileStorageService.getDownloadUrl(fileId, ttl)
  }

  @MessagePattern(MICROSERVICES.FILES_MANAGER.getFilesDownloadUrls)
  async getFilesDownloadUrls(
    @Payload() { filesIds, ttl }: Parameters<FilesManagerServiceMethods['getFilesDownloadUrls']>[0],
  ) {
    return this.fileStorageService.getDownloadUrls(filesIds, ttl)
  }
}
