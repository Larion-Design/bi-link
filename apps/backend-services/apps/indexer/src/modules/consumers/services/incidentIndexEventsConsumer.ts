import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { Job } from 'bull'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { IncidentsIndexerService } from '../../indexer/incident/services/incidentsIndexerService'
import { IncidentEventInfo } from '@app/pub/types/incident'
import { FileParentEntity } from '@app/pub/types/file'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_INCIDENTS } from '../../producers/constants'

@Processor(QUEUE_INCIDENTS)
export class IncidentIndexEventsConsumer {
  private readonly logger = new Logger(IncidentIndexEventsConsumer.name)

  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentsIndexerService: IncidentsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

  @Process(EVENT_CREATED)
  async incidentCreated(job: Job<IncidentEventInfo>) {
    const {
      data: { incidentId },
    } = job

    try {
      if (await this.indexIncidentInfo(incidentId)) {
        return job.moveToCompleted(incidentId)
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async incidentUpdated(job: Job<IncidentEventInfo>) {
    const {
      data: { incidentId },
    } = job

    try {
      if (await this.indexIncidentInfo(incidentId)) {
        return job.moveToCompleted()
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private indexIncidentInfo = async (incidentId: string) => {
    const incident = await this.incidentsService.getIncident(incidentId)
    const indexingSuccessful = await this.incidentsIndexerService.indexIncident(
      incidentId,
      incident,
    )

    if (indexingSuccessful) {
      const filesIds = incident.files.map(({ fileId }) => fileId)

      if (filesIds.length) {
        await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, {
          type: FileParentEntity.INCIDENT,
          id: incidentId,
        })
      }
      return true
    }
  }
}
