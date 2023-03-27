import { VehicleInfo } from 'defs'
import { Field, InputType } from '@nestjs/graphql'
import { TextValueInput } from '../../generic/dto/textValueInput'

@InputType()
export class VehicleInfoInput implements VehicleInfo {
  @Field(() => TextValueInput)
  readonly vin: TextValueInput

  @Field(() => TextValueInput)
  readonly maker: TextValueInput

  @Field(() => TextValueInput)
  readonly model: TextValueInput

  @Field(() => TextValueInput)
  readonly color: TextValueInput
}
