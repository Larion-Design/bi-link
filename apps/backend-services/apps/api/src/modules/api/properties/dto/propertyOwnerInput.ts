import { PropertyOwnerAPI } from 'defs'
import { Field, InputType, PickType } from '@nestjs/graphql'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { OptionalDateValueInput } from '../../generic/dto/optionalDateValueInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { VehicleOwnerInfoInput } from './vehicleOwnerInfoInput'

@InputType()
export class PropertyOwnerInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements PropertyOwnerAPI
{
  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly company: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly person: ConnectedEntityInput

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]

  @Field(() => OptionalDateValueInput)
  readonly startDate: OptionalDateValueInput

  @Field(() => OptionalDateValueInput)
  readonly endDate: OptionalDateValueInput

  @Field(() => VehicleOwnerInfoInput, { nullable: true })
  readonly vehicleOwnerInfo: VehicleOwnerInfoInput
}
