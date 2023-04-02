import { Injectable, Logger } from '@nestjs/common'
import { CompaniesService } from '@app/models/company/services/companiesService'
import { PersonsService } from '@app/models/person/services/personsService'
import { PropertiesService } from '@app/models/property/services/propertiesService'
import { PartyAPI } from 'defs'
import { PartyModel } from '@app/models/event/models/partyModel'
import { CustomFieldsService } from '../../cusotmField/services/customFieldsService'

@Injectable()
export class PartyAPIService {
  private readonly logger = new Logger(PartyAPIService.name)

  constructor(
    private readonly customFieldsService: CustomFieldsService,
    private readonly personsService: PersonsService,
    private readonly propertiesService: PropertiesService,
    private readonly companiesService: CompaniesService,
  ) {}

  createPartiesModels = async (parties: PartyAPI[]) => {
    const personsModels = await this.getPersonsModels(parties)
    const companiesModels = await this.getCompaniesModels(parties)
    const propertiesModels = await this.getPropertiesModels(parties)

    return parties.map((partyInfo) => {
      const partyModel = new PartyModel()
      partyModel.name = partyInfo.name
      partyModel.description = partyInfo.description
      partyModel._confirmed = partyInfo._confirmed

      partyModel.customFields = this.customFieldsService.createCustomFieldsModels(
        partyInfo.customFields,
      )

      partyModel.persons = partyInfo.persons.map(({ _id }) =>
        personsModels.find((personDocument) => String(personDocument._id) === _id),
      )

      partyModel.properties = partyInfo.properties.map(({ _id }) =>
        propertiesModels.find((propertyDocument) => String(propertyDocument._id) === _id),
      )

      partyModel.companies = partyInfo.companies.map(({ _id }) =>
        companiesModels.find((companyDocument) => String(companyDocument._id) === _id),
      )
      return partyModel
    })
  }

  private getPersonsModels = async (parties: PartyAPI[]) => {
    try {
      const personsIds = Array.from(
        new Set(...parties.map(({ persons }) => persons.map(({ _id }) => _id))),
      )
      return personsIds.length ? this.personsService.getPersons(personsIds, false) : []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getPropertiesModels = async (parties: PartyAPI[]) => {
    try {
      const propertiesIds = Array.from(
        new Set(...parties.map(({ properties }) => properties.map(({ _id }) => _id))),
      )
      return propertiesIds.length ? this.propertiesService.getProperties(propertiesIds, false) : []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getCompaniesModels = async (parties: PartyAPI[]) => {
    try {
      const companiesIds = Array.from(
        new Set(...parties.map(({ companies }) => companies.map(({ _id }) => _id))),
      )
      return companiesIds.length ? this.companiesService.getCompanies(companiesIds, false) : []
    } catch (error) {
      this.logger.error(error)
    }
  }
}
