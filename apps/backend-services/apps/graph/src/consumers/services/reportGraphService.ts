import { ReportGraphNode } from '@app/definitions/graph/report'
import { ReportTargetEntityRelationship } from '@app/definitions/graph/reportTargetEntityRelationship'
import { GraphService } from '@app/graph-module'
import { ReportDocument, ReportsService } from '@app/models'
import { Injectable, Logger } from '@nestjs/common'
import { EntityLabel, RelationshipLabel } from 'defs'

@Injectable()
export class ReportGraphService {
  private readonly logger = new Logger(ReportGraphService.name)

  constructor(
    private readonly reportsService: ReportsService,
    private readonly graphService: GraphService,
  ) {}

  upsertReportNode = async (reportId: string) => {
    try {
      const reportDocument = await this.reportsService.getReport(reportId, true)

      if (!reportDocument.isTemplate) {
        return this.graphService.upsertEntity<ReportGraphNode>(
          {
            _id: reportId,
            name: reportDocument.name,
            type: reportDocument.type,
          },
          EntityLabel.REPORT,
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertReportTargetEntity = async ({
    _id,
    company,
    event,
    person,
    property,
  }: ReportDocument) => {
    try {
      const map = new Map<string, ReportTargetEntityRelationship>()
      map.set(company?._id ?? event?._id ?? person?._id ?? property?._id, { _confirmed: true })
      return this.graphService.replaceRelationships(String(_id), map, RelationshipLabel.REPORTED)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
