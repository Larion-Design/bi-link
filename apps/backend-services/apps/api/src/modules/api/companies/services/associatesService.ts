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

  private createPersonsAssociates = async (associates: AssociateAPI[]) => {
    const personsAssociates = associates.filter(({ person }) => !!person?._id)

    if (personsAssociates.length) {
      const personsModels = await this.personService.getPersons(
        personsAssociates.map(({ person: { _id } }) => _id),
        false,
      )
      return personsModels.map((personModel) => {
        const associateInfo = personsAssociates.find(
          ({ person: { _id } }) => _id === String(personModel._id),
        )
        const associate = this.createAssociateModel(associateInfo)
        associate.person = personModel
        return associate
      })
    }
    return []
  }

  private createCompaniesAssociates = async (associates: AssociateAPI[]) => {
    const companiesAssociates = associates.filter(({ company }) => !!company?._id)

    if (companiesAssociates.length) {
      const companiesModels = await this.companiesService.getCompanies(
        companiesAssociates.map(({ company: { _id } }) => _id),
        false,
      )
      return companiesModels.map((companyModel) => {
        const associateInfo = companiesAssociates.find(
          ({ company: { _id } }) => _id === String(companyModel._id),
        )

        const associate = this.createAssociateModel(associateInfo)
        associate.company = companyModel
        return associate
      })
    }
    return []
  }

  createAssociatesModels = async (associates: AssociateAPI[]) => {
    return [
      ...(await this.createPersonsAssociates(associates)),
      ...(await this.createCompaniesAssociates(associates)),
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
