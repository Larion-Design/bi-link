import { Injectable } from '@nestjs/common'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions/connectedEntity'
import { PersonDocument } from '@app/entities/models/personModel'
import { CompanyDocument } from '@app/entities/models/companyModel'
import { PropertyDocument } from '@app/entities/models/propertyModel'

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
      const plateNumbers: string[] = []

      owners.forEach(({ vehicleOwnerInfo }) => {
        if (vehicleOwnerInfo?.registrationNumber.length) {
          plateNumbers.push(vehicleOwnerInfo.registrationNumber)
        }
      })

      propertyIndex.vehicleInfo = {
        vin: vehicleInfo.vin,
        maker: vehicleInfo.maker,
        model: vehicleInfo.model,
        color: vehicleInfo.color,
        plateNumbers,
      }
    }
    return propertyIndex
  }
}
