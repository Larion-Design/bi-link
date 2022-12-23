import { Injectable, Logger } from '@nestjs/common'
import { GraphService } from '@app/graph-module/graphService'
import { CompaniesService } from '@app/entities/services/companiesService'
import { CompanyDocument } from '@app/entities/models/companyModel'
import { AssociateGraphRelationship, CompanyGraphNode } from '@app/graph-module/types'
import { EntityLabel, RelationshipLabel } from '@app/definitions/entitiesGraph'

@Injectable()
export class CompanyGraphService {
  private readonly logger = new Logger(CompanyGraphService.name)

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly graphService: GraphService,
  ) {}

  upsertCompanyNode = async (companyId: string) => {
    try {
      const companyDocument = await this.companiesService.getCompany(companyId)

      await this.graphService.upsertEntity<CompanyGraphNode>(
        {
          _id: companyId,
          name: companyDocument.name,
          cui: companyDocument.cui,
          registrationNumber: companyDocument.registrationNumber,
        },
        EntityLabel.COMPANY,
      )

      await this.upsertCompanyAssociates(companyDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertCompanyAssociates = async (companyDocument: CompanyDocument) => {
    const map = new Map<string, AssociateGraphRelationship>()

    companyDocument.associates.forEach(
      ({ person, company, role, startDate, endDate, isActive, _confirmed, equity }) => {
        const data: AssociateGraphRelationship = {
          role,
          startDate,
          endDate,
          isActive,
          equity,
          _confirmed,
        }

        if (person?._id) {
          map.set(String(person?._id), data)
        } else if (company?._id) {
          map.set(String(company?._id), data)
        }
      },
    )

    if (map.size) {
      return this.graphService.replaceRelationships(
        String(companyDocument._id),
        map,
        RelationshipLabel.ASSOCIATE,
      )
    }
  }
}
