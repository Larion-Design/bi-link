import { Injectable } from '@nestjs/common'
import { IndexerService } from '@app/rpc/services/indexerService'

@Injectable()
export class EntitiesIndexerService {
  constructor(private readonly indexerService: IndexerService) {}

  indexAllPersons = () => this.indexerService.entitiesRefresh('PERSON')
  indexAllCompanies = () => this.indexerService.entitiesRefresh('COMPANY')
  indexAllProperties = () => this.indexerService.entitiesRefresh('PROPERTY')
  indexAllEvents = () => this.indexerService.entitiesRefresh('EVENT')
  indexAllFiles = () => this.indexerService.entitiesRefresh('FILE')
}
