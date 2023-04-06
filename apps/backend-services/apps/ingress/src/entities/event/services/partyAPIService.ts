import { Injectable, Logger } from '@nestjs/common'
import { ConnectedEntity, EventParticipantAPI, Person } from 'defs'
import { CompaniesService } from '../../company/services/companiesService'
import { CustomFieldsService } from '../../customField/services/customFieldsService'
import { PersonDocument } from '../../person/models/personModel'
import { PersonsService } from '../../person/services/personsService'
import { PropertiesService } from '../../property/services/propertiesService'
import { PartyModel } from '../models/partyModel'

@Injectable()
export class PartyAPIService {
  private readonly logger = new Logger(PartyAPIService.name)

  constructor(
    private readonly customFieldsService: CustomFieldsService,
    private readonly personsService: PersonsService,
    private readonly propertiesService: PropertiesService,
    private readonly companiesService: CompaniesService,
  ) {}

  createPartiesModels = async (parties: EventParticipantAPI[]) => {
    const personsMap = await this.getPersonsModels(parties)
    const companiesModels = await this.getCompaniesModels(parties)
    const propertiesModels = await this.getPropertiesModels(parties)

    return parties.map((partyInfo) => {
      const partyModel = new PartyModel()
      partyModel.type = partyInfo.type
      partyModel.description = partyInfo.description
      partyModel.metadata = partyInfo.metadata

      partyModel.customFields = this.customFieldsService.createCustomFieldsModels(
        partyInfo.customFields,
      )

      if (personsMap) {
        partyModel.persons = partyInfo.persons.map(({ _id }) => personsMap.get(_id)!)
      }

      partyModel.properties = partyInfo.properties.map(({ _id }) =>
        propertiesModels.find((propertyDocument) => String(propertyDocument._id) === _id),
      )

      partyModel.companies = partyInfo.companies.map(({ _id }) =>
        companiesModels.find((companyDocument) => String(companyDocument._id) === _id),
      )
      return partyModel
    })
  }

  private getPersonsModels = async (parties: EventParticipantAPI[]) => {
    try {
      const personsIds = Array.from(
        new Set(...parties.map(({ persons }) => persons.map(({ _id }) => _id))),
      )

      const personsMap = new Map<string, PersonDocument>()
      const persons = await this.personsService.getPersons(personsIds, false)
      persons.forEach((person) => personsMap.set(String(person._id), person))
      return personsMap
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getPropertiesModels = async (parties: EventParticipantAPI[]) => {
    try {
      const propertiesIds = Array.from(
        new Set(...parties.map(({ properties }) => properties.map(({ _id }) => _id))),
      )
      return propertiesIds.length ? this.propertiesService.getProperties(propertiesIds, false) : []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getCompaniesModels = async (parties: EventParticipantAPI[]) => {
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
