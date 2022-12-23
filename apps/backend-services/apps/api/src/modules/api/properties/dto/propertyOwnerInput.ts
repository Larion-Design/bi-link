import { PropertyOwnerAPI } from '@app/definitions/propertyOwner'
import { Field, InputType } from '@nestjs/graphql'
import { ConnectedEntityInput } from '../../common/dto/connectedEntityInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { VehicleOwnerInfoInput } from './vehicleOwnerInfoInput'

@InputType()
export class PropertyOwnerInput implements PropertyOwnerAPI {
  @Field()
  readonly _confirmed: boolean

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly company: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly person: ConnectedEntityInput

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]

  @Field({ nullable: true })
  readonly startDate: Date

  @Field({ nullable: true })
  readonly endDate: Date

  @Field(() => VehicleOwnerInfoInput, { nullable: true })
  readonly vehicleOwnerInfo: VehicleOwnerInfoInput
}
