import { Field, ObjectType } from '@nestjs/graphql'
import { IncidentListRecord as IncidentListRecordType } from '@app/definitions/incident'

@ObjectType()
export class IncidentListRecord implements IncidentListRecordType {
  @Field()
  _id: string

  @Field({ nullable: true, defaultValue: '' })
  type: string

  @Field({ nullable: true })
  date: Date

  @Field()
  location: string
}
