import { PropertyListRecord as PropertyListRecordType } from '@app/definitions/property'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PropertyListRecord implements PropertyListRecordType {
  @Field()
  _id: string

  @Field()
  name: string

  @Field()
  type: string
}
