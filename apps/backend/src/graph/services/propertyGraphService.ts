import { Injectable, Logger } from '@nestjs/common'
import { PropertyGraphNode, PropertyOwnerGraphRelationship } from '@modules/definitions'
import { Property } from 'defs'
import { formatDate } from 'tools'
import { GraphService } from './graphService'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class PropertyGraphService {
  private readonly logger = new Logger(PropertyGraphService.name)

  constructor(
    private readonly graphService: GraphService,
    private readonly locationGraphService: LocationGraphService,
  ) {}

  upsertPropertyNode = async (propertyId: string, propertyDocument: Property) => {
    try {
      const propertyNode: PropertyGraphNode = {
        _id: propertyId,
        name: propertyDocument.name,
        type: propertyDocument.type,
      }

      if (propertyDocument.vehicleInfo) {
        const plateNumbers = new Set<string>()

        propertyDocument.owners.forEach(({ vehicleOwnerInfo }) => {
          if (vehicleOwnerInfo) {
            plateNumbers.forEach((plateNumber) => plateNumbers.add(plateNumber))
          }
        })

        if (plateNumbers.size) {
          propertyNode.plateNumbers = Array.from(plateNumbers)
        }
        propertyNode.vin = propertyDocument.vehicleInfo?.vin.value ?? ''
      }

      await this.graphService.upsertEntity<PropertyGraphNode>(propertyNode, 'PROPERTY')
      await this.upsertPropertyOwners(propertyDocument)
      await this.upsertPropertyLocation(propertyDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPropertyOwners = async ({ _id, owners }: Property) => {
    try {
      const map = new Map<string, PropertyOwnerGraphRelationship>()

      owners.forEach(
        ({
          startDate,
          endDate,
          company,
          person,
          metadata: {
            confirmed,
            trustworthiness: { level },
          },
          vehicleOwnerInfo,
        }) => {
          const owner: PropertyOwnerGraphRelationship = {
            _confirmed: confirmed,
            _trustworthiness: level,
            startDate: startDate.value ? formatDate(startDate.value) : undefined,
            endDate: endDate.value ? formatDate(endDate.value) : undefined,
            plateNumbers: vehicleOwnerInfo?.plateNumbers,
          }

          if (startDate?.value) {
            owner.startDate = formatDate(startDate.value)
          }
          if (endDate?.value) {
            owner.endDate = formatDate(endDate.value)
          }
          if (vehicleOwnerInfo) {
            owner.plateNumbers = vehicleOwnerInfo.plateNumbers
          }
          map.set(String(person?._id ?? company?._id), owner)
        },
      )

      if (map.size) {
        return this.graphService.replaceRelationships(String(_id), map, 'OWNER')
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPropertyLocation = async ({ _id, realEstateInfo }: Property) => {
    try {
      const location = realEstateInfo?.location

      if (location) {
        await this.locationGraphService.upsertLocationNode(location)
        await this.locationGraphService.upsertLocationRelationship(
          location.locationId,
          String(_id),
          'LOCATED_AT',
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}
