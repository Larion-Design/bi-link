import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { MICROSERVICES } from '@app/rpc/constants'
import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'

@Injectable()
export class FilesManagerService {
  private readonly logger = new Logger(FilesManagerService.name)

  constructor(@Inject(MICROSERVICES.FILES_MANAGER.id) private client: ClientProxy) {}

  async uploadFile(fileContent: Buffer, mimeType: string) {
    type Params = Parameters<FilesManagerServiceMethods['uploadFile']>[0]
    type Result = ReturnType<FilesManagerServiceMethods['uploadFile']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_MANAGER.uploadFile, {
            mimeType,
            content: fileContent.toString('base64'),
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the files manager service. Make sure the service is running properly.',
      )
    }
  }

  async getFileDownloadUrl(fileId: string, ttl: number) {
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
        'No valid response received from the files manager service. Make sure the service is running properly.',
      )
    }
  }

  async getFilesDownloadUrls(filesIds: string[], ttl: number) {
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
        'No valid response received from the files manager service. Make sure the service is running properly.',
      )
    }
  }

  async extractTextFromFile(fileId: string) {
    type Params = Parameters<FilesManagerServiceMethods['extractTextFromFile']>[0]
    type Result = ReturnType<FilesManagerServiceMethods['extractTextFromFile']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_MANAGER.extractTextFromFile, fileId)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the files manager service. Make sure the service is running properly.',
      )
    }
  }
}
