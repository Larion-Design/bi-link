import { Injectable, Logger } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { PropertyOwnerAPI } from 'defs'
import { CompanyDocument, CompanyModel } from '@app/entities/models/company/companyModel'
import { PersonDocument, PersonModel } from '@app/entities/models/person/personModel'
import { PropertyOwnerModel } from '@app/entities/models/property/propertyOwnerModel'
import { VehicleOwnerInfoModel } from '@app/entities/models/property/vehicleOwnerInfoModel'

@Injectable()
export class PropertyOwnerAPIService {
  private readonly logger = new Logger(PropertyOwnerAPIService.name)

  constructor(
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    private readonly customFieldsService: CustomFieldsService,
  ) {}

  getPropertyOwnersModels = async (owners: PropertyOwnerAPI[]) => [
    ...(await this.createCompaniesOwners(owners)),
    ...(await this.createPersonsOwners(owners)),
  ]

  private createCompaniesOwners = async (owners: PropertyOwnerAPI[]) => {
    try {
      const companiesOwners = owners.filter(({ company }) => !!company?._id)

      if (companiesOwners.length) {
        const companiesDocuments = await this.companyModel
          .find({
            _id: companiesOwners.map(({ company: { _id } }) => _id),
          })
          .exec()

        return companiesDocuments.map((company) => {
          const ownerInfo = companiesOwners.find(
            ({ company: { _id } }) => _id === String(company._id),
          )

          const ownerModel = this.createOwnerModel(ownerInfo)
          ownerModel.company = company
          return ownerModel
        })
      }
      return []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createPersonsOwners = async (owners: PropertyOwnerAPI[]) => {
    try {
      const personsOwners = owners.filter(({ person }) => !!person?._id)

      if (personsOwners.length) {
        const personsDocuments = await this.personModel
          .find({
            _id: personsOwners.map(({ person: { _id } }) => _id),
          })
          .exec()

        return personsDocuments.map((person) => {
          const ownerInfo = personsOwners.find(({ person: { _id } }) => _id === String(person._id))
          const ownerModel = this.createOwnerModel(ownerInfo)
          ownerModel.person = person
          return ownerModel
        })
      }
      return []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createOwnerModel = (ownerInfo: PropertyOwnerAPI) => {
    const ownerModel = new PropertyOwnerModel()
    ownerModel.startDate = ownerInfo.startDate
    ownerModel.endDate = ownerInfo.endDate
    ownerModel.customFields = this.customFieldsService.createCustomFieldsModels(
      ownerInfo.customFields,
    )
    ownerModel._confirmed = ownerInfo._confirmed

    if (ownerInfo.vehicleOwnerInfo) {
      const { plateNumbers } = ownerInfo.vehicleOwnerInfo
      const vehicleOwnerInfoModel = new VehicleOwnerInfoModel()
      vehicleOwnerInfoModel.plateNumbers = plateNumbers
      ownerModel.vehicleOwnerInfo = vehicleOwnerInfoModel
    }
    return ownerModel
  }
}
