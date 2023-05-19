import { MICROSERVICES } from '@app/rpc'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  IngressEntityInputModel,
  IngressServiceMethods,
} from '@app/rpc/microservices/ingress/ingressServiceConfig'
import { ClientProxy } from '@nestjs/microservices'
import { EntityInfo, EntityType, UpdateSource } from 'defs'
import { lastValueFrom, timeout } from 'rxjs'

@Injectable()
export class IngressService {
  private readonly logger = new Logger(IngressService.name)

  constructor(@Inject(MICROSERVICES.INGRESS.id) private client: ClientProxy) {}

  getEntity = async (
    entityInfo: EntityInfo,
    fetchLinkedEntities: boolean,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['getEntity']>[0]
    type Result = ReturnType<IngressServiceMethods['getEntity']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getEntity, {
            entityInfo,
            fetchLinkedEntities,
            source,
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

  getEntities = async (
    entitiesIds: string[],
    entitiesType: EntityType,
    fetchLinkedEntities: boolean,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['getEntities']>[0]
    type Result = ReturnType<IngressServiceMethods['getEntities']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getEntities, {
            entitiesIds,
            entitiesType,
            fetchLinkedEntities,
            source,
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

  getAllEntities = async (entityType: EntityType) => {
    type Params = Parameters<IngressServiceMethods['getAllEntities']>[0]
    type Result = ReturnType<IngressServiceMethods['getAllEntities']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getAllEntities, entityType)
          .pipe(timeout(3000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  createEntity = async (
    entityType: EntityType,
    entityData: IngressEntityInputModel,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['createEntity']>[0]
    type Result = ReturnType<IngressServiceMethods['createEntity']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.createEntity, {
            entityType,
            entityData,
            source,
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

  updateEntity = async (
    entityInfo: EntityInfo,
    entityData: IngressEntityInputModel,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['updateEntity']>[0]
    type Result = ReturnType<IngressServiceMethods['updateEntity']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.updateEntity, {
            entityInfo,
            entityData,
            source,
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

  createPendingSnapshot = async (
    entityInfo: EntityInfo,
    entityData: IngressEntityInputModel,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['createPendingSnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['createPendingSnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.createPendingSnapshot, {
            entityInfo,
            entityData,
            source,
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

  createHistorySnapshot = async (entityInfo: EntityInfo, source: UpdateSource) => {
    type Params = Parameters<IngressServiceMethods['createHistorySnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['createHistorySnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.createHistorySnapshot, {
            entityInfo,
            source,
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

  removePendingSnapshot = async (
    snapshotId: string,
    entityType: EntityType,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['removePendingSnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['removePendingSnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.removePendingSnapshot, {
            snapshotId,
            entityType,
            source,
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

  getPendingSnapshot = async (snapshotId: string, entityType: EntityType, source: UpdateSource) => {
    type Params = Parameters<IngressServiceMethods['getPendingSnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['getPendingSnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getPendingSnapshot, {
            snapshotId,
            entityType,
            source,
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

  getPendingSnapshotsById = async (
    snapshotsIds: string[],
    entityType: EntityType,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['getPendingSnapshotsById']>[0]
    type Result = ReturnType<IngressServiceMethods['getPendingSnapshotsById']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getPendingSnapshotsById, {
            snapshotsIds,
            entityType,
            source,
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

  getPendingSnapshotsByEntity = async (entityInfo: EntityInfo, source: UpdateSource) => {
    type Params = Parameters<IngressServiceMethods['getPendingSnapshotsByEntity']>[0]
    type Result = ReturnType<IngressServiceMethods['getPendingSnapshotsByEntity']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getPendingSnapshotsByEntity, {
            entityInfo,
            source,
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

  getHistorySnapshot = async (snapshotId: string, entityType: EntityType, source: UpdateSource) => {
    type Params = Parameters<IngressServiceMethods['getHistorySnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['getHistorySnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getHistorySnapshot, {
            snapshotId,
            entityType,
            source,
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

  getHistorySnapshotsById = async (
    snapshotsIds: string[],
    entityType: EntityType,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['getHistorySnapshotsById']>[0]
    type Result = ReturnType<IngressServiceMethods['getHistorySnapshotsById']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getHistorySnapshotsById, {
            snapshotsIds,
            entityType,
            source,
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

  getHistorySnapshotsByEntity = async (entityInfo: EntityInfo, source: UpdateSource) => {
    type Params = Parameters<IngressServiceMethods['getHistorySnapshotsByEntity']>[0]
    type Result = ReturnType<IngressServiceMethods['getHistorySnapshotsByEntity']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getHistorySnapshotsByEntity, {
            entityInfo,
            source,
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

  applyPendingSnapshot = async (
    snapshotId: string,
    entityInfo: EntityInfo,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['applyPendingSnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['applyPendingSnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.applyPendingSnapshot, {
            entityInfo,
            snapshotId,
            source,
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

  revertHistorySnapshot = async (
    snapshotId: string,
    entityInfo: EntityInfo,
    source: UpdateSource,
  ) => {
    type Params = Parameters<IngressServiceMethods['revertHistorySnapshot']>[0]
    type Result = ReturnType<IngressServiceMethods['revertHistorySnapshot']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.revertHistorySnapshot, {
            entityInfo,
            snapshotId,
            source,
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

  getFileByHash = async (hash: string) => {
    type Params = Parameters<IngressServiceMethods['getFileByHash']>[0]
    type Result = ReturnType<IngressServiceMethods['getFileByHash']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.getFileByHash, hash)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  getReportsTemplates = async () => {
    type Result = ReturnType<IngressServiceMethods['getReportsTemplates']>

    try {
      return lastValueFrom(
        this.client
          .send<Result>(MICROSERVICES.INGRESS.getReportsTemplates, null)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  findCompanyId = async ({
    cui,
    name,
    registrationNumber,
  }: Parameters<IngressServiceMethods['findCompanyId']>[0]) => {
    type Result = ReturnType<IngressServiceMethods['findCompanyId']>
    type Params = Parameters<IngressServiceMethods['findCompanyId']>[0]

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.findCompanyId, {
            cui,
            name,
            registrationNumber,
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

  findPersonId = async (firstName: string, lastName: string, birthdate?: Date) => {
    type Result = ReturnType<IngressServiceMethods['findPersonId']>
    type Params = Parameters<IngressServiceMethods['findPersonId']>[0]

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.findPersonId, {
            firstName,
            lastName,
            birthdate,
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

  findProceedingId = async (fileNumber: string) => {
    type Result = ReturnType<IngressServiceMethods['findProceedingId']>
    type Params = Parameters<IngressServiceMethods['findProceedingId']>[0]

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INGRESS.findProceedingId, fileNumber)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }
}
