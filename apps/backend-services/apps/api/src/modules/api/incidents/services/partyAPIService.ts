import { Injectable, Logger } from '@nestjs/common'
import { PartyAPI } from '@app/definitions/party'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { PartyDocument, PartyModel } from '@app/entities/models/partyModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { PropertyDocument, PropertyModel } from '@app/entities/models/propertyModel'

@Injectable()
export class PartyAPIService {
  private readonly logger = new Logger(PartyAPIService.name)

  constructor(
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(PartyModel.name) private readonly partyModel: Model<PartyDocument>,
    private readonly customFieldsService: CustomFieldsService,
  ) {}

  createPartiesModelsFromInputData = async (parties: PartyAPI[]) => {
    const personsModels = await this.getPersonsModels(parties)
    const companiesModels = await this.getCompaniesModels(parties)
    const propertiesModels = await this.getPropertiesModels(parties)

    return parties.map((partyInfo) => {
      const partyModel = new PartyModel()
      partyModel.name = partyInfo.name
      partyModel.description = partyInfo.description
      partyModel._confirmed = partyInfo._confirmed

      partyModel.customFields = this.customFieldsService.getCustomFieldsDocumentsForInputData(
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

      if (personsIds.length) {
        return this.personModel.find({ _id: personsIds }).exec()
      }
      return []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getPropertiesModels = async (parties: PartyAPI[]) => {
    try {
      const propertiesIds = Array.from(
        new Set(...parties.map(({ properties }) => properties.map(({ _id }) => _id))),
      )
      if (propertiesIds.length) {
        return this.propertyModel.find({ _id: propertiesIds }).exec()
      }
      return []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getCompaniesModels = async (parties: PartyAPI[]) => {
    try {
      const companiesIds = Array.from(
        new Set(...parties.map(({ companies }) => companies.map(({ _id }) => _id))),
      )

      if (companiesIds.length) {
        return this.companyModel.find({ _id: companiesIds }).exec()
      }
      return []
    } catch (error) {
      this.logger.error(error)
    }
  }
}
