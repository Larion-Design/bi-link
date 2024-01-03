import { Field, InputType } from '@nestjs/graphql'
import { RealEstateInfo } from 'defs'
import { BooleanValueInput } from '../../generic/dto/booleanValueInput'
import { NumberValueInput } from '../../generic/dto/numberValueInput'
import { LocationInput } from '../../geolocation/dto/locationInput'

@InputType()
export class RealEstateInfoInput implements RealEstateInfo {
  @Field(() => LocationInput, { nullable: true })
  location: LocationInput

  @Field(() => NumberValueInput)
  surface: NumberValueInput

  @Field(() => BooleanValueInput)
  townArea: BooleanValueInput
}
