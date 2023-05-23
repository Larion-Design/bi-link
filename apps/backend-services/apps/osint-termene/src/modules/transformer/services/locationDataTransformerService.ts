import { Injectable } from '@nestjs/common'
import { LocationAPIInput } from 'defs'
import { getDefaultLocation } from 'tools'
import { CompanyTermeneDataset } from '../../../schema/company'

@Injectable()
export class LocationDataTransformerService {
  transformHeadquartersData = (data: CompanyTermeneDataset): LocationAPIInput | null => {
    const address = data.profileInfo?.adresa.sediu_social
    return address
      ? {
          ...getDefaultLocation(),
          locality: address.localitate,
          county: address.judet,
          zipCode: String(address.cod_postal),
          otherInfo: address.formatat,
        }
      : null
  }

  transformBranchesData = (data: CompanyTermeneDataset): LocationAPIInput[] => {
    const branches: LocationAPIInput[] = []
    const currentDate = new Date()

    data.branches?.puncteSiSubsidiare.forEach(({ pana_la, adresa }) => {
      if (!pana_la.length || new Date(pana_la) > currentDate) {
        branches.push({
          ...getDefaultLocation(),
          otherInfo: adresa,
        })
      }
    })
    return branches
  }

  getAddress = (address: string, sourceUrl?: string) => {
    const locationInfo = getDefaultLocation()
    locationInfo.otherInfo = address

    if (sourceUrl) {
      locationInfo.metadata.trustworthiness.source = sourceUrl
    }
    return locationInfo
  }
}
