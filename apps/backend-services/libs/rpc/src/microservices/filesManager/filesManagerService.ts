import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { MICROSERVICES } from '@app/rpc'
import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'

@Injectable()
export class FilesManagerService {
  private readonly logger = new Logger(FilesManagerService.name)

  constructor(@Inject(MICROSERVICES.FILES_MANAGER.id) private client: ClientProxy) {}

  uploadFile = async (fileContent: Buffer) => {
    type Params = Parameters<FilesManagerServiceMethods['uploadFile']>[0]
    type Result = ReturnType<FilesManagerServiceMethods['uploadFile']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_MANAGER.uploadFile, fileContent)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  getFileDownloadUrl = async (fileId: string, ttl: number) => {
    type Params = Parameters<FilesManagerServiceMethods['getFileDownloadUrl']>[0]
    type Result = ReturnType<FilesManagerServiceMethods['getFileDownloadUrl']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_MANAGER.getFileDownloadUrl, { fileId, ttl })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  getFilesDownloadUrls = async (filesIds: string[], ttl: number) => {
    type Params = Parameters<FilesManagerServiceMethods['getFilesDownloadUrls']>[0]
    type Result = ReturnType<FilesManagerServiceMethods['getFilesDownloadUrls']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_MANAGER.getFilesDownloadUrls, { filesIds, ttl })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  getFileContent = async (fileId: string) => {
    type Params = Parameters<FilesManagerServiceMethods['getFileContent']>[0]
    type Result = ReturnType<FilesManagerServiceMethods['getFileContent']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_MANAGER.getFilesDownloadUrls, fileId)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }
}
