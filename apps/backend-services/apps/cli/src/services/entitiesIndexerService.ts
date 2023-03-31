import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EntitiesIndexerService {
  constructor(private readonly indexerService: IndexerService) {}

  indexAllPersons = () => this.indexerService.reindexEntities('PERSON')
  indexAllCompanies = () => this.indexerService.reindexEntities('COMPANY')
  indexAllProperties = () => this.indexerService.reindexEntities('PROPERTY')
  indexAllEvents = () => this.indexerService.reindexEntities('EVENT')
  indexAllFiles = () => this.indexerService.reindexEntities('FILE')
}
