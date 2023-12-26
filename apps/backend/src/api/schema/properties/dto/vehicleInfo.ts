import { VehicleInfo as VehicleInfoType } from 'defs'
import { Field, ObjectType } from '@nestjs/graphql'
import { TextValue } from '../../generic/dto/textValue'

@ObjectType()
export class VehicleInfo implements VehicleInfoType {
  @Field()
  vin: TextValue

  @Field()
  maker: TextValue

  @Field()
  model: TextValue

  @Field()
  color: TextValue
}
