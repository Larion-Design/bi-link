import { ActivityEventIndex } from '@app/definitions/indexer/activityEvent'
import { MICROSERVICES } from '@app/rpc'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { EntityInfo, EntityType } from 'defs'
import { IndexerServiceMethods } from '@app/rpc/microservices/indexer/indexerServiceConfig'

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name)

  constructor(@Inject(MICROSERVICES.INDEXER.id) private client: ClientProxy) {}

  search = async (searchTerm: string, entityType: EntityType, limit: number, skip: number) => {
    type Params = Parameters<IndexerServiceMethods['search']>[0]
    type Result = ReturnType<IndexerServiceMethods['search']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.search, {
            entityType,
            searchTerm,
            limit,
            skip,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  indexEntity = (entityEventInfo: EntityInfo) => {
    try {
      type Params = Parameters<IndexerServiceMethods['indexEntity']>[0]
      type Result = ReturnType<IndexerServiceMethods['indexEntity']>

      this.client.emit<Result, Params>(MICROSERVICES.INDEXER.indexEntity, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  reindexEntities = (entityType: EntityType) => {
    try {
      type Params = Parameters<IndexerServiceMethods['reindexEntities']>[0]
      type Result = ReturnType<IndexerServiceMethods['reindexEntities']>

      this.client.emit<Result, Params>(MICROSERVICES.INDEXER.reindexEntities, entityType)
    } catch (e) {
      this.logger.error(e)
    }
  }

  createMapping = (indexMapping: EntityType | 'ACTIVITY_EVENT') => {
    try {
      type Params = Parameters<IndexerServiceMethods['createMapping']>[0]
      type Result = ReturnType<IndexerServiceMethods['createMapping']>

      this.client.emit<Result, Params>(MICROSERVICES.INDEXER.createMapping, indexMapping)
    } catch (e) {
      this.logger.error(e)
    }
  }

  recordHistoryEvent = (activityEvent: ActivityEventIndex) => {
    try {
      type Params = Parameters<IndexerServiceMethods['recordHistoryEvent']>[0]
      type Result = ReturnType<IndexerServiceMethods['recordHistoryEvent']>

      this.client.emit<Result, Params>(MICROSERVICES.INDEXER.recordHistoryEvent, activityEvent)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getFileContent = (fileId: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['getFileContent']>[0]
      type Result = ReturnType<IndexerServiceMethods['getFileContent']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.getFileContent, fileId)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  personCNPExists = (cnp: string, personId?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['personCNPExists']>[0]
      type Result = ReturnType<IndexerServiceMethods['personCNPExists']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.personCNPExists, {
            cnp,
            personId,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  personIdDocumentExists = (documentNumber: string, personId?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['personIdDocumentExists']>[0]
      type Result = ReturnType<IndexerServiceMethods['personIdDocumentExists']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.personIdDocumentExists, {
            documentNumber,
            personId,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  companyCUIExists = (cui: string, companyId?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['companyCUIExists']>[0]
      type Result = ReturnType<IndexerServiceMethods['companyCUIExists']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.companyCUIExists, {
            cui,
            companyId,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  companyRegistrationNumberExists = (registrationNumber: string, companyId?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['companyRegistrationNumberExists']>[0]
      type Result = ReturnType<IndexerServiceMethods['companyRegistrationNumberExists']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.companyRegistrationNumberExists, {
            registrationNumber,
            companyId,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  vehicleVINExists = (vin: string, propertyId?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['vehicleVINExists']>[0]
      type Result = ReturnType<IndexerServiceMethods['vehicleVINExists']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.vehicleVINExists, {
            vin,
            propertyId,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  getVehiclesMakers = (model?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['getVehiclesMakers']>[0]
      type Result = ReturnType<IndexerServiceMethods['getVehiclesMakers']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.getVehiclesMakers, model)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  getVehiclesModels = (maker?: string) => {
    try {
      type Params = Parameters<IndexerServiceMethods['getVehiclesModels']>[0]
      type Result = ReturnType<IndexerServiceMethods['getVehiclesModels']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.getVehiclesModels, maker)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }
}
