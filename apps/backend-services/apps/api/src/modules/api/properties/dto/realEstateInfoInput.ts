import { Field, InputType } from '@nestjs/graphql'
import { RealEstateAPIInput } from 'defs'
import { LocationInput } from '../../common/dto/geolocation/locationInput'

@InputType()
export class RealEstateInfoInput implements RealEstateAPIInput {
  @Field(() => LocationInput, { nullable: true })
  location: LocationInput

  @Field()
  surface: number

  @Field()
  townArea: boolean
}
