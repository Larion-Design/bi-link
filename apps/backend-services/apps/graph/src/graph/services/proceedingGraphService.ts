import { IngressService } from '@app/rpc/microservices/ingress'
import { Injectable, Logger } from '@nestjs/common'
import { ProceedingGraphNode } from '@app/definitions/graph/proceeding'
import { ProceedingEntityRelationship } from '@app/definitions/graph/proceedingEntity'
import { Proceeding, proceedingSchema } from 'defs'
import { ProceedingDocument } from '../../../../ingress/src/entities/proceeding/models/proceedingModel'
import { GraphService } from './graphService'

@Injectable()
export class ProceedingGraphService {
  private readonly logger = new Logger(ProceedingGraphService.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly graphService: GraphService,
  ) {}

  upsertProceedingNode = async (proceedingId: string) => {
    try {
      const proceedingDocument = await this.getProceedingInfo(proceedingId)

      await this.graphService.upsertEntity<ProceedingGraphNode>(
        {
          _id: proceedingId,
          type: proceedingDocument.type,
          name: proceedingDocument.name,
          fileNumber: proceedingDocument.fileNumber,
          year: proceedingDocument.year,
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

    proceedingDocument.entitiesInvolved.forEach(({ person, company, involvedAs }) =>
      map.set(person?._id ?? company?._id, {
        _confirmed: true,
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
