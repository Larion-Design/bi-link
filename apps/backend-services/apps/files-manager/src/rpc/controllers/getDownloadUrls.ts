import { MICROSERVICES } from '@app/rpc'
import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FileStorageService } from '../../files/services/fileStorageService'

@Controller()
export class GetDownloadUrls {
  constructor(private readonly fileStorageService: FileStorageService) {}

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
