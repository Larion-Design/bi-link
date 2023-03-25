import { PropertyOwnerAPI } from 'defs'
import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { CustomField } from '../../customFields/dto/customField'
import { Metadata } from '../../metadata/dto/metadata'
import { VehicleOwnerInfo } from './vehicleOwnerInfo'

@ObjectType()
export class PropertyOwner implements PropertyOwnerAPI {
  @Field(() => Metadata)
  metadata: Metadata

  @Field(() => ConnectedEntity, { nullable: true })
  company: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  person: ConnectedEntity

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field({ nullable: true })
  startDate: Date

  @Field({ nullable: true })
  endDate: Date

  @Field(() => VehicleOwnerInfo, { nullable: true })
  vehicleOwnerInfo: VehicleOwnerInfo
}
