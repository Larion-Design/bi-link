import { CompanyDocument } from '@app/entities/models/company/companyModel'
import { CompaniesService } from '@app/entities/services/companiesService'
import { GraphService } from '@app/graph-module/graphService'
import { AssociateGraphRelationship, CompanyGraphNode } from '@app/graph-module/types'
import { Injectable, Logger } from '@nestjs/common'
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

  private upsertCompanyLocations = async (companyDocument: CompanyDocument) => {
    const locations = new Set(companyDocument.locations)

    if (companyDocument.headquarters) {
      locations.add(companyDocument.headquarters)
    }

    if (locations.size) {
      await this.locationGraphservice.upsertLocationNodes(Array.from(locations))

      const companyId = String(companyDocument._id)

      if (companyDocument.headquarters) {
        await this.locationGraphservice.upsertLocationRelationship(
          companyDocument.headquarters.locationId,
          companyId,
          RelationshipLabel.HQ_AT,
        )
      }

      if (companyDocument.locations.length) {
        await this.locationGraphservice.upsertLocationsRelationships(
          companyId,
          companyDocument.locations.map(({ locationId }) => locationId),
          RelationshipLabel.BRANCH_AT,
        )
      }
    }
  }
}
