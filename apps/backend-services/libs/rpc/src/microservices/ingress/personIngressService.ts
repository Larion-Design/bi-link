import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { PersonAPIInput, UpdateSource } from 'defs'
import { lastValueFrom, timeout } from 'rxjs'
import {
  ingressServiceConfig,
  PersonIngressMethods,
} from '@app/rpc/microservices/ingress/serviceConfig'

@Injectable()
export class PersonIngressService {
  private readonly logger = new Logger(PersonIngressService.name)

  constructor(@Inject(ingressServiceConfig.id) private client: ClientProxy) {}

  getPerson = (personId: string, fetchLinkedEntities: boolean) => {
    try {
      type Result = ReturnType<PersonIngressMethods['getPerson']>
      type Params = Parameters<PersonIngressMethods['getPerson']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.getPerson, {
            personId,
            fetchLinkedEntities,
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

  getPersons = (personsIds: string[], fetchLinkedEntities: boolean) => {
    try {
      type Result = ReturnType<PersonIngressMethods['getPersons']>
      type Params = Parameters<PersonIngressMethods['getPersons']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.getPerson, {
            personsIds,
            fetchLinkedEntities,
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

  applyPersonSnapshot = (snapshotId: string) => {
    try {
      type Result = ReturnType<PersonIngressMethods['applyPersonSnapshot']>
      type Params = Parameters<PersonIngressMethods['applyPersonSnapshot']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.applyPersonSnapshot, snapshotId)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  createPerson = (data: PersonAPIInput) => {
    try {
      type Result = ReturnType<PersonIngressMethods['createPerson']>
      type Params = Parameters<PersonIngressMethods['createPerson']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.createPerson, data)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  createPersonHistorySnapshot = (personId: string, source: UpdateSource) => {
    try {
      type Result = ReturnType<PersonIngressMethods['createPersonHistorySnapshot']>
      type Params = Parameters<PersonIngressMethods['createPersonHistorySnapshot']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.createPersonHistorySnapshot, {
            personId,
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

  createPersonPendingSnapshot = (personId: string, data: PersonAPIInput, source: UpdateSource) => {
    try {
      type Result = ReturnType<PersonIngressMethods['createPersonPendingSnapshot']>
      type Params = Parameters<PersonIngressMethods['createPersonPendingSnapshot']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.createPersonPendingSnapshot, {
            personId,
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

  getAllPersonSnapshots = (personId: string) => {
    try {
      type Result = ReturnType<PersonIngressMethods['getAllPersonSnapshots']>
      type Params = Parameters<PersonIngressMethods['getAllPersonSnapshots']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.getAllPersonSnapshots, personId)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  getPersonSnapshot = (snapshotId: string) => {
    try {
      type Result = ReturnType<PersonIngressMethods['getPersonSnapshot']>
      type Params = Parameters<PersonIngressMethods['getPersonSnapshot']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.getPersonSnapshot, snapshotId)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  getPersonSnapshots = (snapshotsIds: string[]) => {
    try {
      type Result = ReturnType<PersonIngressMethods['getPersonSnapshots']>
      type Params = Parameters<PersonIngressMethods['getPersonSnapshots']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.getPersonSnapshots, snapshotsIds)
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  updatePerson = (personId: string, data: PersonAPIInput) => {
    try {
      type Result = ReturnType<PersonIngressMethods['updatePerson']>
      type Params = Parameters<PersonIngressMethods['updatePerson']>[0]

      return lastValueFrom(
        this.client
          .send<Result, Params>(ingressServiceConfig.persons.getPersonSnapshots, { personId, data })
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
