import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { FilesParserServiceMethods } from '@app/rpc/microservices/filesParser/filesParserServiceConfig'
import { MICROSERVICES } from '@app/rpc/constants'

@Injectable()
export class FileParserService {
  private readonly logger = new Logger(FileParserService.name)

  constructor(@Inject(MICROSERVICES.FILES_PARSER.id) private readonly client: ClientProxy) {}

  extractText = async (fileId: string) => {
    try {
      type Params = Parameters<FilesParserServiceMethods['extractText']>[0]
      type Result = ReturnType<FilesParserServiceMethods['extractText']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.FILES_PARSER.extractText, fileId)
          .pipe(timeout(60000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the files parser service. Make sure the service is running properly.',
      )
    }
  }
}
