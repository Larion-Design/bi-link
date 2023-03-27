import { PropertyOwnerAPI } from 'defs'
import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { CustomField } from '../../customFields/dto/customField'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { VehicleOwnerInfo } from './vehicleOwnerInfo'

@ObjectType()
export class PropertyOwner
  extends PickType(WithMetadata, ['metadata'] as const)
  implements PropertyOwnerAPI
{
  @Field(() => ConnectedEntity, { nullable: true })
  company: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  person: ConnectedEntity

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field(() => OptionalDateValue)
  startDate: OptionalDateValue

  @Field(() => OptionalDateValue)
  endDate: OptionalDateValue

  @Field(() => VehicleOwnerInfo, { nullable: true })
  vehicleOwnerInfo: VehicleOwnerInfo
}
