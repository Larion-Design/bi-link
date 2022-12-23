import { Field, Int, ObjectType } from '@nestjs/graphql'
import { IncidentListRecord } from './incidentListRecord'

@ObjectType()
export class IncidentsSuggestions {
  @Field(() => [IncidentListRecord])
  records: IncidentListRecord[]

  @Field(() => Int, { nullable: false })
  total: number
}
