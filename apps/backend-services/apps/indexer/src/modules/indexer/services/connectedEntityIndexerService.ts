import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions/search/connectedEntity'
import { Injectable } from '@nestjs/common'
import { PersonDocument } from '@app/models/models/person/personModel'
import { CompanyDocument } from '@app/models/models/company/companyModel'
import { PropertyDocument } from '@app/models/models/property/propertyModel'

@Injectable()
export class ConnectedEntityIndexerService {
  createConnectedPersonIndex = ({
    _id,
    firstName,
    lastName,
    cnp,
    documents,
  }: PersonDocument): ConnectedPersonIndex => ({
    _id: String(_id),
    firstName: firstName,
    lastName: lastName,
    cnp: cnp,
    documents: documents.map(({ documentNumber }) => documentNumber),
  })

  createConnectedCompanyIndex = ({
    _id,
    name,
    cui,
    registrationNumber,
  }: CompanyDocument): ConnectedCompanyIndex => ({
    _id: String(_id),
    name,
    cui,
    registrationNumber,
  })

  createConnectedPropertyIndex = ({
    _id,
    type,
    vehicleInfo,
    owners,
  }: PropertyDocument): ConnectedPropertyIndex => {
    const propertyIndex: ConnectedPropertyIndex = {
      _id: String(_id),
      type,
    }

    if (vehicleInfo) {
      const plateNumbers = new Set<string>()
      owners.forEach(({ vehicleOwnerInfo }) => {
        vehicleOwnerInfo?.plateNumbers.forEach((plateNumber) => plateNumbers.add(plateNumber))
      })

      propertyIndex.vehicleInfo = {
        vin: vehicleInfo.vin,
        maker: vehicleInfo.maker,
        model: vehicleInfo.model,
        color: vehicleInfo.color,
        plateNumbers: Array.from(plateNumbers),
      }
    }
    return propertyIndex
  }
}
