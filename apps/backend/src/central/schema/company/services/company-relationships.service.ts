import { CustomFieldsService } from '@modules/central/schema/customField/services/customFieldsService'
import { Injectable } from '@nestjs/common'
import { CompaniesService } from '@modules/central/schema/company/services/companiesService'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
import { getDefaultCompanyRelationship } from 'default-values'
import { CompanyRelationship } from 'defs'
import { CompanyRelationshipModel } from '@modules/central/schema/company/models/company-relationship.model'

@Injectable()
export class CompanyRelationshipsService {
  constructor(
    private readonly personService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly customFieldsService: CustomFieldsService,
  ) {}

  async createCompanyRelationshipsModels(
    relationships: CompanyRelationship[],
  ): Promise<CompanyRelationshipModel[]> {
    const personsSet = new Set<string>()
    const companiesSet = new Set<string>()

    relationships.forEach(({ company, person }) => {
      if (company?._id) {
        companiesSet.add(company._id)
      } else if (person?._id) {
        personsSet.add(person?._id)
      }
    })

    const companyRelationshipsModels: CompanyRelationshipModel[] = []

    if (personsSet.size) {
      const personsDocuments = await this.personService.getPersons(Array.from(personsSet), false)

      personsDocuments.forEach((personDocument) => {
        const relationship = relationships.find(
          ({ person }) => person?._id === personDocument._id.toString(),
        )

        if (relationship) {
          companyRelationshipsModels.push(
            this.createCompanyRelationshipModel({
              ...getDefaultCompanyRelationship(relationship.type),
              person: { _id: personDocument._id },
            }),
          )
        }
      })
    }
    if (companiesSet.size) {
      const companiesDocuments = await this.companiesService.getCompanies(
        Array.from(companiesSet),
        false,
      )

      companiesDocuments.forEach((companyDocument) => {
        const relationship = relationships.find(
          ({ company }) => company?._id === companyDocument._id.toString(),
        )

        if (relationship) {
          companyRelationshipsModels.push(
            this.createCompanyRelationshipModel({
              ...getDefaultCompanyRelationship(relationship.type),
              company: { _id: companyDocument._id },
            }),
          )
        }
      })
    }
    return companyRelationshipsModels
  }

  private createCompanyRelationshipModel(relationship: CompanyRelationship) {
    const model = new CompanyRelationshipModel()
    model.type = relationship.type
    model.metadata = relationship.metadata
    model.customFields = this.customFieldsService.createCustomFieldsModels(
      relationship.customFields,
    )
    return model
  }
}
