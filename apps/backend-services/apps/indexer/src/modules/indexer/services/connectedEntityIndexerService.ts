import { Injectable } from '@nestjs/common'
import { Company, Person, Property } from 'defs'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions'

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
    firstName: firstName.value,
    lastName: lastName.value,
    cnp: cnp.value,
    documents: documents?.map(({ documentNumber }) => documentNumber) ?? [],
  })

  createConnectedCompanyIndex = ({
    _id,
    name,
    cui,
    registrationNumber,
  }: Company): ConnectedCompanyIndex => ({
    _id: String(_id),
    name: name.value,
    cui: cui.value,
    registrationNumber: registrationNumber.value,
  })

  createConnectedPropertyIndex = ({
    _id,
    type,
    name,
    vehicleInfo,
    owners,
  }: Property): ConnectedPropertyIndex => {
    const propertyIndex: ConnectedPropertyIndex = {
      _id: String(_id),
      type,
      name,
    }

    if (vehicleInfo) {
      const plateNumbers = new Set<string>()
      owners.forEach(({ vehicleOwnerInfo }) => {
        vehicleOwnerInfo?.plateNumbers.forEach((plateNumber) => plateNumbers.add(plateNumber))
      })

      propertyIndex.vehicleInfo = {
        vin: vehicleInfo.vin.value,
        maker: vehicleInfo.maker.value,
        model: vehicleInfo.model.value,
        color: vehicleInfo.color.value,
        plateNumbers: Array.from(plateNumbers),
      }
    }
    return propertyIndex
  }
}
