import { Field, ObjectType } from '@nestjs/graphql'
import { BooleanValue } from '../../generic/dto/booleanValue'
import { NumberValue } from '../../generic/dto/numberValue'
import { Location } from '../../geolocation/dto/location'
import { RealEstateInfo as RealEstateInfoAPI } from 'defs'

@ObjectType()
export class RealEstateInfo implements RealEstateInfoAPI {
  @Field(() => Location, { nullable: true })
  location: Location

  @Field(() => NumberValue)
  surface: NumberValue

  @Field(() => BooleanValue)
  townArea: BooleanValue
}
