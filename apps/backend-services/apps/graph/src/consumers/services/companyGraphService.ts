import { Injectable, Logger } from '@nestjs/common'
import { CompanyDocument } from '@app/models/company/models/companyModel'
import { CompaniesService } from '@app/models/company/services/companiesService'
import { GraphService } from '@app/graph-module/graphService'
import { AssociateGraphRelationship, CompanyGraphNode } from '@app/definitions/graph'
import { EntityLabel, RelationshipLabel } from 'defs'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class CompanyGraphService {
  private readonly logger = new Logger(CompanyGraphService.name)

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly graphService: GraphService,
    private readonly locationGraphservice: LocationGraphService,
  ) {}

  upsertCompanyNode = async (companyId: string) => {
    try {
      const companyDocument = await this.companiesService.getCompany(companyId, true)

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
      await this.upsertCompanyLocations(companyDocument)
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

  private upsertCompanyLocations = async ({ _id, headquarters, locations }: CompanyDocument) => {
    const companyLocations = new Set(locations)

    if (headquarters) {
      companyLocations.add(headquarters)
    }

    if (companyLocations.size) {
      await this.locationGraphservice.upsertLocationNodes(Array.from(companyLocations))

      const companyId = String(_id)
      const relationshipsQueries = []

      if (headquarters) {
        relationshipsQueries.push(
          this.locationGraphservice.upsertLocationRelationship(
            headquarters.locationId,
            companyId,
            RelationshipLabel.HQ_AT,
          ),
        )
      }

      if (locations.length) {
        relationshipsQueries.push(
          this.locationGraphservice.upsertLocationsRelationships(
            companyId,
            locations.map(({ locationId }) => locationId),
            RelationshipLabel.BRANCH_AT,
          ),
        )
      }
      await Promise.allSettled(relationshipsQueries)
    }
  }
}
