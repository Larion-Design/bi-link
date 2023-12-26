import {
  ReportGraphNode,
  ReportTargetEntityRelationship,
} from '@modules/definitions';
import { Injectable, Logger } from '@nestjs/common';
import { Report, reportSchema } from 'defs';
import { GraphService } from './graphService';

@Injectable()
export class ReportGraphService {
  private readonly logger = new Logger(ReportGraphService.name);

  constructor(private readonly graphService: GraphService) {}

  upsertReportNode = async (reportId: string) => {
    try {
      const reportDocument = await this.getReport(reportId);

      if (!reportDocument.isTemplate) {
        await this.graphService.upsertEntity<ReportGraphNode>(
          {
            _id: reportId,
            name: reportDocument.name,
            type: reportDocument.type,
          },
          'REPORT',
        );

        await this.upsertReportTargetEntity(reportDocument);
      }
    } catch (e) {
      this.logger.error(e);
    }
  };

  private upsertReportTargetEntity = async ({
    _id,
    company,
    event,
    person,
    property,
  }: Report) => {
    try {
      const map = new Map<string, ReportTargetEntityRelationship>();
      const entityId =
        company?._id ?? event?._id ?? person?._id ?? (property?._id as string);

      map.set(entityId, {
        _confirmed: true,
        _trustworthiness: 0,
      });
      return this.graphService.replaceRelationships(
        String(_id),
        map,
        'REPORTED',
      );
    } catch (e) {
      this.logger.error(e);
    }
  };

  private getReport = async (reportId: string) =>
    reportSchema.parse(
      await this.ingressService.getEntity(
        { entityId: reportId, entityType: 'REPORT' },
        true,
        {
          type: 'SERVICE',
          sourceId: 'SERVICE_GRAPH',
        },
      ),
    );
}
