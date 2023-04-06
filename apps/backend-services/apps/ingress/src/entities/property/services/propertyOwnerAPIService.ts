import { Injectable } from '@nestjs/common'
import { PropertyOwnerAPI } from 'defs'
import { CompaniesService } from '../../company/services/companiesService'
import { CustomFieldsService } from '../../customField/services/customFieldsService'
import { PersonsService } from '../../person/services/personsService'
import { PropertyOwnerModel } from '../models/propertyOwnerModel'
import { VehicleOwnerInfoModel } from '../models/vehicleOwnerInfoModel'

@Injectable()
export class PropertyOwnerAPIService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly customFieldsService: CustomFieldsService,
  ) {}

  getPropertyOwnersModels = async (owners: PropertyOwnerAPI[]) => {
    const personsIds = new Set<string>()
    const companiesIds = new Set<string>()
    const ownersMap = new Map<string, PropertyOwnerAPI>()

    owners.forEach((owner) => {
      const { person, company } = owner

      if (person?._id) {
        personsIds.add(person._id)
        ownersMap.set(person._id, owner)
      } else if (company?._id) {
        companiesIds.add(company._id)
        ownersMap.set(company._id, owner)
      }
    })

    return [
      ...(await this.createPersonsOwners(Array.from(personsIds), ownersMap)),
      ...(await this.createCompaniesOwners(Array.from(companiesIds), ownersMap)),
    ]
  }

  private createPersonsOwners = async (
    personsIds: string[],
    ownersMap: Map<string, PropertyOwnerAPI>,
  ) => {
    if (personsIds) {
      const persons = await this.personsService.getPersons(Array.from(personsIds), true)
      return persons.map((personDocument) => {
        const ownerInfo = ownersMap.get(String(personDocument))!
        const ownerModel = this.createOwnerModel(ownerInfo)
        ownerModel.person = personDocument
      })
    }
    return []
  }

  private createCompaniesOwners = async (
    companiesIds: string[],
    ownersMap: Map<string, PropertyOwnerAPI>,
  ) => {
    if (companiesIds) {
      const companies = await this.companiesService.getCompanies(companiesIds, true)
      return companies.map((companyDocument) => {
        const ownerInfo = ownersMap.get(String(companyDocument))!
        const ownerModel = this.createOwnerModel(ownerInfo)
        ownerModel.company = companyDocument
      })
    }
    return []
  }

  private createOwnerModel = (ownerInfo: PropertyOwnerAPI) => {
    const ownerModel = new PropertyOwnerModel()
    ownerModel.metadata = ownerInfo.metadata
    ownerModel.startDate = ownerInfo.startDate
    ownerModel.endDate = ownerInfo.endDate
    ownerModel.customFields = this.customFieldsService.createCustomFieldsModels(
      ownerInfo.customFields,
    )

    if (ownerInfo.vehicleOwnerInfo) {
      const { plateNumbers } = ownerInfo.vehicleOwnerInfo
      const vehicleOwnerInfoModel = new VehicleOwnerInfoModel()
      vehicleOwnerInfoModel.plateNumbers = plateNumbers
      ownerModel.vehicleOwnerInfo = vehicleOwnerInfoModel
    }
    return ownerModel
  }
}
