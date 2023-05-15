import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene/osintTermeneServiceConfig'

@Injectable()
export class OsintTermeneService {
  private readonly logger = new Logger(OsintTermeneService.name)

  constructor(@Inject(MICROSERVICES.OSINT.TERMENE.id) private client: ClientProxy) {}

  getCompanyInfoByCUI = async (cui: string) => {
    type Params = Parameters<OsintTermeneServiceConfig['getCompanyInfoByCUI']>[0]
    type Result = ReturnType<OsintTermeneServiceConfig['getCompanyInfoByCUI']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.OSINT.TERMENE.getCompanyInfoByCUI, cui)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the OSINT Termene service. Make sure the service is running properly.',
      )
    }
  }

  getCompanyInfoByName = async (companyName: string) => {
    type Params = Parameters<OsintTermeneServiceConfig['getCompanyInfoByName']>[0]
    type Result = ReturnType<OsintTermeneServiceConfig['getCompanyInfoByName']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.OSINT.TERMENE.getCompanyInfoByCUI, companyName)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }
}
