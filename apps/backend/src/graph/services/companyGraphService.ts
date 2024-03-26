import { CompanyDocument } from '@modules/central/schema/company/models/companyModel'
import { Injectable } from '@nestjs/common'
import { Company, RelationshipMetadata } from 'defs'
import { AssociateGraphRelationship, CompanyGraphNode } from '@modules/definitions'
import { GraphService } from './graphService'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class CompanyGraphService {
  constructor(
    private readonly graphService: GraphService,
    private readonly locationGraphService: LocationGraphService,
  ) {}

  async upsertCompaniesNodes(companyDocuments: CompanyDocument[]) {
    await this.graphService.upsertEntities<CompanyGraphNode>(
      companyDocuments.map((companyDocument) => ({
        _id: String(companyDocument._id),
        name: companyDocument.name.value,
        cui: companyDocument.cui.value,
        registrationNumber: companyDocument.registrationNumber.value,
      })),
      'COMPANY',
    )

    for await (const companyDocument of companyDocuments) {
      await this.upsertCompanyAssociates(companyDocument)
      await this.upsertCompanyLocations(companyDocument)
      await this.upsertCompanyRelationships(companyDocument)
    }
  }

  async upsertCompanyNode(companyId: string, companyDocument: Company) {
    await this.graphService.upsertEntity<CompanyGraphNode>(
      {
        _id: String(companyId),
        name: companyDocument.name.value,
        cui: companyDocument.cui.value,
        registrationNumber: companyDocument.registrationNumber.value,
      },
      'COMPANY',
    )

    await Promise.all([
      this.upsertCompanyAssociates(companyDocument),
      this.upsertCompanyLocations(companyDocument),
      this.upsertCompanyRelationships(companyDocument),
    ])
  }

  private async upsertCompanyAssociates(companyDocument: Company) {
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
          map.set(String(person._id), data)
        } else if (company?._id) {
          map.set(String(company._id), data)
        }
      },
    )

    if (map.size) {
      return this.graphService.replaceRelationships(String(companyDocument._id), map, 'ASSOCIATE')
    }
  }

  private async upsertCompanyRelationships({ _id, relationships }: Company) {
    if (!relationships?.length) return

    const competitorsCompanies = new Map<string, RelationshipMetadata>()
    const competitorsPersons = new Map<string, RelationshipMetadata>()
    const suppliersPersons = new Map<string, RelationshipMetadata>()
    const suppliersCompanies = new Map<string, RelationshipMetadata>()
    const disputingCompanies = new Map<string, RelationshipMetadata>()
    const disputingPersons = new Map<string, RelationshipMetadata>()

    relationships?.forEach(({ person, company, metadata, type }) => {
      const relationshipData: RelationshipMetadata = {
        _confirmed: metadata.confirmed,
        _trustworthiness: metadata.trustworthiness.level,
      }

      switch (type) {
        case 'DISPUTING': {
          if (person?._id) {
            disputingPersons.set(person._id, relationshipData)
          } else if (company?._id) {
            disputingCompanies.set(company._id, relationshipData)
          }
          break
        }
        case 'COMPETITOR': {
          if (person?._id) {
            competitorsPersons.set(person._id, relationshipData)
          } else if (company?._id) {
            competitorsCompanies.set(company._id, relationshipData)
          }
          break
        }
        case 'SUPPLIER': {
          if (person?._id) {
            suppliersPersons.set(person._id, relationshipData)
          } else if (company?._id) {
            suppliersCompanies.set(company._id, relationshipData)
          }
          break
        }
      }
    })

    const companyId = String(_id)
    const relationshipsQueries: Promise<void>[] = []

    if (suppliersCompanies.size) {
      relationshipsQueries.push(
        this.graphService.replaceRelationships(companyId, suppliersCompanies, 'SUPPLIER'),
      )
    }
    if (suppliersPersons.size) {
      relationshipsQueries.push(
        this.graphService.replaceRelationships(companyId, suppliersPersons, 'SUPPLIER'),
      )
    }

    if (competitorsPersons.size) {
      relationshipsQueries.push(
        this.graphService.replaceRelationships(companyId, competitorsPersons, 'COMPETITOR'),
      )
    }
    if (competitorsCompanies.size) {
      relationshipsQueries.push(
        this.graphService.replaceRelationships(companyId, competitorsCompanies, 'COMPETITOR'),
      )
    }

    if (disputingPersons.size) {
      relationshipsQueries.push(
        this.graphService.replaceRelationships(companyId, disputingPersons, 'DISPUTING'),
      )
    }

    if (disputingCompanies.size) {
      relationshipsQueries.push(
        this.graphService.replaceRelationships(companyId, disputingCompanies, 'DISPUTING'),
      )
    }

    if (relationshipsQueries.length) {
      await Promise.all(relationshipsQueries)
    }
  }

  private async upsertCompanyLocations({ _id, headquarters, locations }: Company) {
    const companyLocations = new Set(locations)

    if (headquarters) {
      companyLocations.add(headquarters)
    }

    if (companyLocations.size) {
      await this.locationGraphService.upsertLocationNodes(Array.from(companyLocations))

      const companyId = String(_id)
      const relationshipsQueries: Promise<void>[] = []

      if (headquarters) {
        relationshipsQueries.push(
          this.locationGraphService.upsertLocationRelationship(
            headquarters.locationId,
            companyId,
            'HQ_AT',
          ),
        )
      }

      if (locations.length) {
        relationshipsQueries.push(
          this.locationGraphService.upsertLocationsRelationships(
            companyId,
            locations.map(({ locationId }) => locationId),
            'BRANCH_AT',
          ),
        )
      }

      if (relationshipsQueries.length) {
        await Promise.all(relationshipsQueries)
      }
    }
  }
}
