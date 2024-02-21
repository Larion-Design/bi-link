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
    associates: Map<string, AssociateAPI[]>,
  ): Promise<AssociateModel[]> {
    if (associates.size) {
      const personsModels = await this.personService.getPersons(
        Array.from(associates.keys()),
        false,
      )

      const associatesModels: AssociateModel[] = []

      personsModels.forEach((personModel) => {
        const associatesInfo = associates.get(String(personModel._id))

        if (associatesInfo?.length) {
          associatesModels.push(
            ...associatesInfo.map((associateInfo) => {
              const associate = this.createAssociateModel(associateInfo)
              associate.person = personModel
              return associate
            }),
          )
        }
      })
      return associatesModels
    }
    return []
  }

  private async createCompaniesAssociates(associates: Map<string, AssociateAPI[]>) {
    if (associates.size) {
      const companiesModels = await this.companiesService.getCompanies(
        Array.from(associates.keys()),
        false,
      )

      const associatesModels: AssociateModel[] = []

      companiesModels.forEach((companyModel) => {
        const associatesInfo = associates.get(String(companyModel._id))

        if (associatesInfo?.length) {
          associatesModels.push(
            ...associatesInfo.map((associateInfo) => {
              const associate = this.createAssociateModel(associateInfo)
              associate.company = companyModel
              return associate
            }),
          )
        }
      })
      return associatesModels
    }
    return []
  }

  async createAssociatesModels(associates: AssociateAPI[]) {
    const personsAssociatesMap = new Map<string, AssociateAPI[]>()
    const companiesAssociatesMap = new Map<string, AssociateAPI[]>()

    associates.forEach((associateInfo) => {
      const personId = associateInfo.person?._id
      const companyId = associateInfo.company?._id

      if (personId) {
        const personAssociates = personsAssociatesMap.get(personId)

        if (!personAssociates) {
          personsAssociatesMap.set(personId, [associateInfo])
        } else personAssociates.push(associateInfo)
      } else if (companyId) {
        const companyAssociates = companiesAssociatesMap.get(companyId)

        if (!companyAssociates) {
          companiesAssociatesMap.set(companyId, [associateInfo])
        } else companyAssociates.push(associateInfo)
      } else throw new Error('Associates must be mapped to a person or a company.')
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
