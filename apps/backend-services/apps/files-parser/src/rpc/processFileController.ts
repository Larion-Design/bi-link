import { FilesManagerService } from '@app/rpc/microservices/filesManager/filesManagerService'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ParserService } from '../services/parserService'
import { MICROSERVICES } from '@app/rpc/constants'

@Controller()
export class ProcessFileController {
  private readonly logger = new Logger(ProcessFileController.name)

  constructor(
    private readonly parserService: ParserService,
    private readonly filesManagerService: FilesManagerService,
  ) {}

  @MessagePattern(MICROSERVICES.FILES_PARSER.extractText)
  async extractText(@Payload() fileId: string) {
    const fileContent = await this.filesManagerService.getFileContent(fileId)

    if (fileContent?.buffer.byteLength) {
      this.logger.debug(`Processed file ID ${fileId}`)
      return this.parserService.parseFile(fileId, fileContent)
    }
  }
}
