import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { LocationAPIOutput } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { Coordinates } from './coordinates'

@ObjectType()
export class Location
  extends PickType(WithMetadata, ['metadata'] as const)
  implements LocationAPIOutput
{
  @Field(() => ID, { nullable: true, defaultValue: '' })
  locationId: string

  @Field({ nullable: true, defaultValue: '' })
  building: string

  @Field({ nullable: true, defaultValue: '' })
  country: string

  @Field({ nullable: true, defaultValue: '' })
  county: string

  @Field({ nullable: true, defaultValue: '' })
  door: string

  @Field({ nullable: true, defaultValue: '' })
  locality: string

  @Field({ nullable: true, defaultValue: '' })
  number: string

  @Field({ nullable: true, defaultValue: '' })
  otherInfo: string

  @Field({ nullable: true, defaultValue: '' })
  street: string

  @Field({ nullable: true, defaultValue: '' })
  zipCode: string

  @Field(() => Coordinates)
  coordinates: Coordinates
}
