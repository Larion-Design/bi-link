import { PropertyAPIInput } from 'defs'
import { Field, InputType } from '@nestjs/graphql'
import { FileInput } from '../../files/dto/fileInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { PropertyOwnerInput } from './propertyOwnerInput'
import { RealEstateInfoInput } from './realEstateInfoInput'
import { VehicleInfoInput } from './vehicleInfoInput'

@InputType()
export class PropertyInput implements PropertyAPIInput {
  @Field()
  name: string

  @Field()
  type: string

  @Field(() => [PropertyOwnerInput])
  owners: PropertyOwnerInput[]

  @Field(() => [FileInput])
  files: FileInput[]

  @Field(() => [FileInput])
  images: FileInput[]

  @Field(() => [CustomFieldInput])
  customFields: CustomFieldInput[]

  @Field(() => VehicleInfoInput, { nullable: true })
  vehicleInfo: VehicleInfoInput

  @Field(() => RealEstateInfoInput, { nullable: true })
  realEstateInfo: RealEstateInfoInput
}
