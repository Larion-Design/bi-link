import { PropertyOwnerAPI } from '@app/definitions/propertyOwner'
import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectedEntity } from '../../common/dto/connectedEntity'
import { CustomField } from '../../customFields/dto/customField'
import { VehicleOwnerInfo } from './vehicleOwnerInfo'

@ObjectType()
export class PropertyOwner implements PropertyOwnerAPI {
  @Field()
  _confirmed: boolean

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
