import { Field, InputType } from '@nestjs/graphql'
import { LocationAPIInput } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'
import { CoordinatesInput } from './coordinatesInput'

@InputType()
export class LocationInput implements LocationAPIInput {
  @Field(() => MetadataInput)
  metadata: MetadataInput

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
  locationId: string

  @Field({ nullable: true, defaultValue: '' })
  number: string

  @Field({ nullable: true, defaultValue: '' })
  otherInfo: string

  @Field({ nullable: true, defaultValue: '' })
  street: string

  @Field({ nullable: true, defaultValue: '' })
  zipCode: string

  @Field(() => CoordinatesInput)
  coordinates: CoordinatesInput
}
