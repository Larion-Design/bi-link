import { PropertyOwnerAPI } from 'defs'
import { Field, InputType, PickType } from '@nestjs/graphql'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
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

  @Field(() => OptionalDateValue)
  readonly startDate: OptionalDateValue

  @Field(() => OptionalDateValue)
  readonly endDate: OptionalDateValue

  @Field(() => VehicleOwnerInfoInput, { nullable: true })
  readonly vehicleOwnerInfo: VehicleOwnerInfoInput
}
