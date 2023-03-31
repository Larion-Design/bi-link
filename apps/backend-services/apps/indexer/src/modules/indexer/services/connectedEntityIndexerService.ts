import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions'
import { Injectable } from '@nestjs/common'
import { Company, Person, Property } from 'defs'

@Injectable()
export class ConnectedEntityIndexerService {
  createConnectedPersonIndex = ({
    _id,
    firstName,
    lastName,
    cnp,
    documents,
  }: Person): ConnectedPersonIndex => ({
    _id: String(_id),
    firstName: firstName,
    lastName: lastName,
    cnp: cnp,
    documents: documents?.map(({ documentNumber }) => documentNumber) ?? [],
  })

  createConnectedCompanyIndex = ({
    _id,
    name,
    cui,
    registrationNumber,
  }: Company): ConnectedCompanyIndex => ({
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
  }: Property): ConnectedPropertyIndex => {
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
