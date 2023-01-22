import { Injectable } from '@nestjs/common'
import { AssociateModel } from '@app/entities/models/associateModel'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { PersonsService } from '@app/entities/services/personsService'
import { AssociateInput } from '../dto/associateInput'
import { CompaniesService } from '@app/entities/services/companiesService'

@Injectable()
export class AssociatesService {
  constructor(
    private readonly customFieldsService: CustomFieldsService,
    private readonly personService: PersonsService,
    private readonly companiesService: CompaniesService,
  ) {}

  private createPersonsAssociates = async (associates: AssociateInput[]) => {
    const personsAssociates = associates.filter(({ person }) => !!person?._id)

    if (personsAssociates.length) {
      const personsModels = await this.personService.getPersonsDocuments(
        personsAssociates.map(({ person: { _id } }) => _id),
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

  private createCompaniesAssociates = async (associates: AssociateInput[]) => {
    const companiesAssociates = associates.filter(({ company }) => !!company?._id)

    if (companiesAssociates.length) {
      const companiesModels = await this.companiesService.getCompaniesDocuments(
        companiesAssociates.map(({ company: { _id } }) => _id),
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

  getAssociatesDocumentsForInputData = async (associates: AssociateInput[]) => {
    return [
      ...(await this.createPersonsAssociates(associates)),
      ...(await this.createCompaniesAssociates(associates)),
    ]
  }

  private createAssociateModel = (associateInfo: AssociateInput) => {
    const associate = new AssociateModel()
    associate.role = associateInfo.role
    associate.startDate = associateInfo.startDate
    associate.endDate = associateInfo.endDate
    associate.equity = associateInfo.equity
    associate.isActive = associateInfo.isActive
    associate.customFields = this.customFieldsService.getCustomFieldsDocumentsForInputData(
      associateInfo.customFields,
    )
    associate._confirmed = associateInfo._confirmed
    return associate
  }
}
