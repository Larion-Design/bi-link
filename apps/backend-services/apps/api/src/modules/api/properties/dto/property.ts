import { PropertyAPIOutput } from 'defs'
import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { Timestamps } from 'defs'
import { File } from '../../files/dto/file'
import { CustomField } from '../../customFields/dto/customField'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { PropertyOwner } from './propertyOwner'
import { RealEstateInfo } from './realEstateInfo'
import { VehicleInfo } from './vehicleInfo'

@ObjectType()
export class Property
  extends PickType(WithMetadata, ['metadata'] as const)
  implements PropertyAPIOutput, Timestamps
{
  @Field(() => ID)
  _id: string

  @Field()
  name: string

  @Field()
  type: string

  @Field(() => [PropertyOwner])
  owners: PropertyOwner[]

  @Field(() => [File])
  files: File[]

  @Field(() => [File])
  images: File[]

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field(() => VehicleInfo, { nullable: true })
  vehicleInfo: VehicleInfo

  @Field(() => RealEstateInfo, { nullable: true })
  realEstateInfo: RealEstateInfo

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
