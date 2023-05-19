import { Injectable } from '@nestjs/common'
import { LocationAPIInput, UpdateSource } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'

@Injectable()
export class LocationLoaderService {
  constructor(private readonly ingressService: IngressService) {}

  createLocation = async (locationInfo: LocationAPIInput, author: UpdateSource) =>
    this.ingressService.createEntity('LOCATION', locationInfo, author)

  createLocations = async (locationsInfo: LocationAPIInput[], author: UpdateSource) =>
    Promise.allSettled(
      locationsInfo.map((locationInfo) => this.createLocation(locationInfo, author)),
    )
}
