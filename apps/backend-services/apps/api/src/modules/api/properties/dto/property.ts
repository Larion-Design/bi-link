import { PropertyAPIOutput } from '@app/definitions/property'
import { Field, ObjectType } from '@nestjs/graphql'
import { File } from '../../files/dto/file'
import { CustomField } from '../../customFields/dto/customField'
import { PropertyOwner } from './propertyOwner'
import { VehicleInfo } from './vehicleInfo'

@ObjectType()
export class Property implements PropertyAPIOutput {
  @Field()
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
}
