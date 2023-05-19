import { LocationAPIInput } from 'defs'
import { MetadataDiffService } from './metadataDiffService'

export class LocationDiffService {
  constructor(private readonly metadataDiffService: MetadataDiffService) {}

  areObjectsEqual = (locationA: LocationAPIInput, locationB: LocationAPIInput) =>
    (locationA.otherInfo === locationB.otherInfo ||
      (locationA.zipCode === locationB.zipCode &&
        locationA.street === locationB.street &&
        locationA.number === locationB.number &&
        locationA.building === locationB.building &&
        locationA.door === locationB.door &&
        locationA.locality === locationB.locality &&
        locationA.county === locationB.county &&
        locationA.country === locationB.country) ||
      (locationA.coordinates.lat === locationB.coordinates.lat &&
        locationA.coordinates.long === locationB.coordinates.long)) &&
    this.metadataDiffService.areObjectsEqual(locationA.metadata, locationB.metadata)

  areLocationsListsEqual = (locationsA: LocationAPIInput[], locationsB: LocationAPIInput[]) =>
    locationsA.length === locationsB.length &&
    locationsA.every((locationA) =>
      locationsB.some((locationB) => this.areObjectsEqual(locationA, locationB)),
    )
}
