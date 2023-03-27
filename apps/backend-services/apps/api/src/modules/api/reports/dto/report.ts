import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ReportAPIOutput } from 'defs'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { DataRef } from './refs/dataRef'
import { ReportSection } from './reportSection'

@ObjectType()
export class Report implements ReportAPIOutput {
  @Field(() => ID)
  _id: string

  @Field()
  name: string

  @Field()
  type: string

  @Field()
  isTemplate: boolean

  @Field(() => [ConnectedEntity], { nullable: true })
  person?: ConnectedEntity

  @Field(() => [ConnectedEntity], { nullable: true })
  company?: ConnectedEntity

  @Field(() => [ConnectedEntity], { nullable: true })
  property?: ConnectedEntity

  @Field(() => [ConnectedEntity], { nullable: true })
  event?: ConnectedEntity

  @Field(() => [ReportSection])
  sections: ReportSection[]

  @Field(() => [DataRef])
  refs: DataRef[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
