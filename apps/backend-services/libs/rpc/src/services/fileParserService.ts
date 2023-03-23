import { Inject, Injectable, Logger } from '@nestjs/common'
import { MICROSERVICES } from '@app/rpc/constants'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'

@Injectable()
export class FileParserService {
  private readonly logger = new Logger(FileParserService.name)

  constructor(@Inject(MICROSERVICES.FILES_PARSER.id) private readonly client: ClientProxy) {}

  extractText = async (fileId: string) => {
    try {
      return lastValueFrom(
        this.client
          .send<string, string>(MICROSERVICES.FILES_PARSER.extractText, fileId)
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
