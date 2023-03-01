import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ParserService } from '../services/parserService'
import { MICROSERVICES } from '@app/pub/constants'
import { FileStorageService } from '@app/files/services/fileStorageService'

@Controller()
export class ProcessFileController {
  private readonly logger = new Logger(ProcessFileController.name)

  constructor(
    private readonly parserService: ParserService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @MessagePattern(MICROSERVICES.FILES_PARSER.extractText)
  async extractText(@Payload() fileId: string) {
    const fileContent = await this.fileStorageService.getFileContent(fileId)

    if (fileContent) {
      this.logger.debug(`Processed file ID ${fileId}`)
      return this.parserService.parseFile(fileId, fileContent)
    }
  }
}