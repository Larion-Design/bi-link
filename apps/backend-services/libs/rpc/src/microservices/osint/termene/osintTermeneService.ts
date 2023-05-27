import { RPCValidator } from '@app/rpc/interceptors/RPCValidator'
import { Inject, Injectable, Logger, UseInterceptors } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { MICROSERVICES } from '@app/rpc'
import {
  osintTermeneServiceConfig,
  OsintTermeneServiceConfig,
} from '@app/rpc/microservices/osint/termene/osintTermeneServiceConfig'

@Injectable()
export class OsintTermeneService {
  private readonly logger = new Logger(OsintTermeneService.name)

  constructor(@Inject(MICROSERVICES.OSINT.TERMENE.id) private client: ClientProxy) {}

  @UseInterceptors(new RPCValidator(osintTermeneServiceConfig.shape.searchCompanyByCUI))
  async searchCompanyByCUI(cui: string) {
    type Params = Parameters<OsintTermeneServiceConfig['searchCompanyByCUI']>[0]
    type Result = ReturnType<OsintTermeneServiceConfig['searchCompanyByCUI']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.OSINT.TERMENE.searchCompanyByCUI, cui)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the OSINT Termene service. Make sure the service is running properly.',
      )
    }
  }

  @UseInterceptors(new RPCValidator(osintTermeneServiceConfig.shape.searchCompaniesByName))
  async searchCompaniesByName(companyName: string) {
    type Params = Parameters<OsintTermeneServiceConfig['searchCompaniesByName']>[0]
    type Result = ReturnType<OsintTermeneServiceConfig['searchCompaniesByName']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.OSINT.TERMENE.searchCompaniesByName, companyName)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  @UseInterceptors(new RPCValidator(osintTermeneServiceConfig.shape.importCompany))
  importCompany(cui: string) {
    type Params = Parameters<OsintTermeneServiceConfig['importCompany']>[0]

    try {
      return this.client.emit<Params>(MICROSERVICES.OSINT.TERMENE.importCompany, cui)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
