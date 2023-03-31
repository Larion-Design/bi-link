import { Injectable, Logger } from '@nestjs/common'
import { ProceedingGraphNode } from '@app/definitions/graph/proceeding'
import { ProceedingEntityRelationship } from '@app/definitions/graph/proceedingEntity'
import { GraphService } from '@app/graph-module'
import { ProceedingDocument } from '@app/models'
import { ProceedingsService } from '@app/models/proceeding/services/proceedingsService'
import { EntityLabel, RelationshipLabel } from 'defs'

@Injectable()
export class ProceedingGraphService {
  private readonly logger = new Logger(ProceedingGraphService.name)

  constructor(
    private readonly proceedingsService: ProceedingsService,
    private readonly graphService: GraphService,
  ) {}

  upsertProceedingNode = async (proceedingId: string) => {
    try {
      const proceedingDocument = await this.proceedingsService.getProceeding(proceedingId, true)

      await this.graphService.upsertEntity<ProceedingGraphNode>(
        {
          _id: proceedingId,
          type: proceedingDocument.type,
          name: proceedingDocument.name,
          fileNumber: proceedingDocument.fileNumber,
          year: proceedingDocument.year,
        },
        EntityLabel.PROCEEDING,
      )
      return this.upsertProceedingParties(proceedingDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertProceedingParties = async (proceedingDocument: ProceedingDocument) => {
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
      RelationshipLabel.INVOLVED_AS,
    )
  }
}
