import { Injectable, Logger } from '@nestjs/common'
import { Company } from 'defs'
import { AssociateGraphRelationship, CompanyGraphNode } from '@modules/definitions'
import { GraphService } from './graphService'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class CompanyGraphService {
  private readonly logger = new Logger(CompanyGraphService.name)

  constructor(
    private readonly graphService: GraphService,
    private readonly locationGraphservice: LocationGraphService,
  ) {}

  upsertCompanyNode = async (companyId: string, companyDocument: Company) => {
    try {
      await this.graphService.upsertEntity<CompanyGraphNode>(
        {
          _id: companyId,
          name: companyDocument.name.value,
          cui: companyDocument.cui.value,
          registrationNumber: companyDocument.registrationNumber.value,
        },
        'COMPANY',
      )

      await this.upsertCompanyAssociates(companyDocument)
      await this.upsertCompanyLocations(companyDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertCompanyAssociates = async (companyDocument: Company) => {
    const map = new Map<string, AssociateGraphRelationship>()

    companyDocument.associates.forEach(
      ({
        person,
        company,
        role,
        startDate,
        endDate,
        isActive,
        equity,
        metadata: {
          confirmed,
          trustworthiness: { level },
        },
      }) => {
        const data: AssociateGraphRelationship = {
          role: role.value,
          startDate: startDate.value,
          endDate: endDate.value,
          isActive: isActive.value,
          equity: equity.value,
          _confirmed: confirmed,
          _trustworthiness: level,
        }

        if (person?._id) {
          map.set(String(person?._id), data)
        } else if (company?._id) {
          map.set(String(company?._id), data)
        }
      },
    )

    if (map.size) {
      return this.graphService.replaceRelationships(String(companyDocument._id), map, 'ASSOCIATE')
    }
  }

  private upsertCompanyLocations = async ({ _id, headquarters, locations }: Company) => {
    const companyLocations = new Set(locations)

    if (headquarters) {
      companyLocations.add(headquarters)
    }

    if (companyLocations.size) {
      await this.locationGraphservice.upsertLocationNodes(Array.from(companyLocations))

      const companyId = String(_id)
      const relationshipsQueries: Promise<void>[] = []

      if (headquarters) {
        relationshipsQueries.push(
          this.locationGraphservice.upsertLocationRelationship(
            headquarters.locationId,
            companyId,
            'HQ_AT',
          ),
        )
      }

      if (locations.length) {
        relationshipsQueries.push(
          this.locationGraphservice.upsertLocationsRelationships(
            companyId,
            locations.map(({ locationId }) => locationId),
            'BRANCH_AT',
          ),
        )
      }
      await Promise.allSettled(relationshipsQueries)
    }
  }
}
