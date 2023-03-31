import { Injectable } from '@nestjs/common'
import { AssociateAPI } from 'defs'
import { AssociateModel } from '@app/models/company/models/associateModel'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { PersonsService } from '@app/models/person/services/personsService'
import { CompaniesService } from '@app/models/company/services/companiesService'

@Injectable()
export class AssociatesService {
  constructor(
    private readonly customFieldsService: CustomFieldsService,
    private readonly personService: PersonsService,
    private readonly companiesService: CompaniesService,
  ) {}

  private createPersonsAssociates = async (associates: Map<string, AssociateAPI>) => {
    if (associates.size) {
      const personsModels = await this.personService.getPersons(
        Array.from(associates.keys()),
        false,
      )
      return personsModels.map((personModel) => {
        const associateInfo = associates.get(String(personModel._id))

        if (associateInfo) {
          const associate = this.createAssociateModel(associateInfo)
          associate.person = personModel
          return associate
        }
      })
    }
    return []
  }

  private createCompaniesAssociates = async (associates: Map<string, AssociateAPI>) => {
    if (associates.size) {
      const companiesModels = await this.companiesService.getCompanies(
        Array.from(associates.keys()),
        false,
      )

      return companiesModels.map((companyModel) => {
        const associateInfo = associates.get(String(companyModel._id))

        if (associateInfo) {
          const associate = this.createAssociateModel(associateInfo)
          associate.company = companyModel
          return associate
        }
      })
    }
    return []
  }

  createAssociatesModels = async (associates: AssociateAPI[]) => {
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
