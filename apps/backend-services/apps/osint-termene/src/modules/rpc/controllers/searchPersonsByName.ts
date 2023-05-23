import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AssociateDatasetScraperService } from '../../extractor'

type Params = Parameters<OsintTermeneServiceConfig['searchPersons']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['searchPersons']> | undefined

@Controller()
export class SearchPersonsByName {
  constructor(private readonly associateScraperService: AssociateDatasetScraperService) {}

  @MessagePattern(MICROSERVICES.OSINT.TERMENE.searchPersons)
  async searchCompanyByCUI(@Payload() cui: Params): Promise<Result> {
    return this.associateScraperService.searchAssociatesByName(cui)
  }
}
