import { Injectable, Logger } from '@nestjs/common'
import { ProceedingGraphNode, ProceedingEntityRelationship } from '@modules/definitions'
import { Proceeding, proceedingSchema } from 'defs'
import { GraphService } from './graphService'

@Injectable()
export class ProceedingGraphService {
  private readonly logger = new Logger(ProceedingGraphService.name)

  constructor(private readonly graphService: GraphService) {}

  upsertProceedingNode = async (proceedingId: string) => {
    try {
      const proceedingDocument = await this.getProceedingInfo(proceedingId)

      await this.graphService.upsertEntity<ProceedingGraphNode>(
        {
          _id: proceedingId,
          type: proceedingDocument.type,
          name: proceedingDocument.name,
          fileNumber: proceedingDocument.fileNumber.value,
          year: proceedingDocument.year.value,
          status: proceedingDocument.status.value,
        },
        'PROCEEDING',
      )
      return this.upsertProceedingParties(proceedingDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertProceedingParties = async (proceedingDocument: Proceeding) => {
    const map = new Map<string, ProceedingEntityRelationship>()

    proceedingDocument.entitiesInvolved.forEach(
      ({
        person,
        company,
        involvedAs,
        metadata: {
          confirmed,
          trustworthiness: { level },
        },
      }) =>
        map.set(person?._id ?? (company?._id as string), {
          _confirmed: confirmed,
          _trustworthiness: level,
          involvedAs,
        }),
    )

    return this.graphService.replaceRelationships(
      String(proceedingDocument._id),
      map,
      'INVOLVED_AS',
    )
  }

  private getProceedingInfo = async (proceedingId: string) =>
    proceedingSchema.parse(
      await this.ingressService.getEntity(
        {
          entityId: proceedingId,
          entityType: 'PROCEEDING',
        },
        true,
        {
          type: 'SERVICE',
          sourceId: 'SERVICE_GRAPH',
        },
      ),
    )
}
