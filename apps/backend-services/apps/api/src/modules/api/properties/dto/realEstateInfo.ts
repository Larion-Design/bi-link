import { Field, ObjectType } from '@nestjs/graphql'
import { RealEstateAPIOutput } from 'defs'
import { Location } from '../../common/dto/geolocation/location'

@ObjectType()
export class RealEstateInfo implements RealEstateAPIOutput {
  @Field(() => Location, { nullable: true })
  location: Location

  @Field()
  surface: number

  @Field()
  townArea: boolean
}
