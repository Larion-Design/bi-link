import { Injectable } from '@nestjs/common'
import { CompanyAPIOutput, PersonAPIOutput, PropertyAPIOutput } from 'defs'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@modules/definitions'
import { LocationIndexerService } from './locationIndexerService'

@Injectable()
export class ConnectedEntityIndexerService {
  constructor(private readonly locationIndexerService: LocationIndexerService) {}

  createConnectedPersonIndex = ({
    _id,
    firstName,
    lastName,
    cnp,
    documents,
  }: PersonAPIOutput): ConnectedPersonIndex => ({
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
  }: CompanyAPIOutput): ConnectedCompanyIndex => ({
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
    realEstateInfo,
    owners,
  }: PropertyAPIOutput): ConnectedPropertyIndex => {
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

    if (realEstateInfo) {
      propertyIndex.realEstateInfo = {
        surface: realEstateInfo.surface.value,
        townArea: realEstateInfo.townArea.value,
        location: realEstateInfo.location
          ? this.locationIndexerService.createLocationIndexData(realEstateInfo.location)
          : undefined,
      }
    }
    return propertyIndex
  }
}
