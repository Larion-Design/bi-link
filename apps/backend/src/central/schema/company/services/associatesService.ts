import { Injectable } from '@nestjs/common'
import { AssociateAPI } from 'defs'
import { CustomFieldsService } from '../../customField/services/customFieldsService'
import { PersonsService } from '../../person/services/personsService'
import { AssociateModel } from '../models/associateModel'
import { CompaniesService } from './companiesService'

@Injectable()
export class AssociatesService {
  constructor(
    private readonly customFieldsService: CustomFieldsService,
    private readonly personService: PersonsService,
    private readonly companiesService: CompaniesService,
  ) {}

  private async createPersonsAssociates(
    associates: Map<string, AssociateAPI>,
  ): Promise<AssociateModel[]> {
    if (associates.size) {
      const personsModels = await this.personService.getPersons(
        Array.from(associates.keys()),
        false,
      )

      const associatesModels: AssociateModel[] = []

      personsModels.forEach((personModel) => {
        const associateInfo = associates.get(String(personModel._id))

        if (associateInfo) {
          const associate = this.createAssociateModel(associateInfo)
          associate.person = personModel
          associatesModels.push(associate)
        }
      })
      return associatesModels
    }
    return []
  }

  private async createCompaniesAssociates(associates: Map<string, AssociateAPI>) {
    if (associates.size) {
      const companiesModels = await this.companiesService.getCompanies(
        Array.from(associates.keys()),
        false,
      )

      const associatesModels: AssociateModel[] = []

      companiesModels.forEach((companyModel) => {
        const associateInfo = associates.get(String(companyModel._id))

        if (associateInfo) {
          const associate = this.createAssociateModel(associateInfo)
          associate.company = companyModel
          associatesModels.push(associate)
        }
      })

      return associatesModels
    }
    return []
  }

  async createAssociatesModels(associates: AssociateAPI[]) {
    const personsAssociatesMap = new Map<string, AssociateAPI>()
    const companiesAssociatesMap = new Map<string, AssociateAPI>()

    associates.forEach((associateInfo) => {
      if (associateInfo.person?._id) {
        personsAssociatesMap.set(associateInfo.person?._id, associateInfo)
      } else if (associateInfo.company?._id) {
        companiesAssociatesMap.set(associateInfo.company?._id, associateInfo)
      }
    })

    return [
      ...(await this.createPersonsAssociates(personsAssociatesMap)),
      ...(await this.createCompaniesAssociates(companiesAssociatesMap)),
    ]
  }

  private createAssociateModel = (associateInfo: AssociateAPI) => {
    const associate = new AssociateModel()
    associate.metadata = associateInfo.metadata
    associate.role = associateInfo.role
    associate.startDate = associateInfo.startDate
    associate.endDate = associateInfo.endDate
    associate.equity = associateInfo.equity
    associate.isActive = associateInfo.isActive
    associate.customFields = this.customFieldsService.createCustomFieldsModels(
      associateInfo.customFields,
    )
    return associate
  }
}
