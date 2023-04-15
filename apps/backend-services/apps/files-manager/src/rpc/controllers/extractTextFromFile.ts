import { Controller } from '@nestjs/common'
import { MICROSERVICES } from '@app/rpc'
import { FilesManagerServiceMethods } from '@app/rpc/microservices/filesManager/filesManagerServiceConfig'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FileStorageService } from '../../files/services/fileStorageService'
import { TextExtractorService } from '../../files/services/textExtractorService'

type Params = Parameters<FilesManagerServiceMethods['extractTextFromFile']>[0]
type Result = ReturnType<FilesManagerServiceMethods['extractTextFromFile']>

@Controller()
export class ExtractTextFromFile {
  constructor(
    private readonly textExtractorService: TextExtractorService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @MessagePattern(MICROSERVICES.FILES_MANAGER.extractTextFromFile)
  async getFileDownloadUrl(@Payload() fileId: Params): Promise<Result> {
    const buffer = await this.fileStorageService.getFileContent(fileId)
    return this.textExtractorService.parseFile(fileId, buffer)
  }
}
