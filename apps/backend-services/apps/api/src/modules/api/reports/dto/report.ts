import {Field, ObjectType} from '@nestjs/graphql'
import {ReportAPIOutput} from 'defs'
import {ConnectedEntity} from '../../common/dto/connectedEntity'
import {ReportSection} from './reportSection'

@ObjectType()
export class Report implements ReportAPIOutput {
  @Field()
  _id: string

  @Field()
  name: string

  @Field(() => [ConnectedEntity], { nullable: true })
  person?: ConnectedEntity

  @Field(() => [ConnectedEntity], { nullable: true })
  company?: ConnectedEntity

  @Field(() => [ConnectedEntity], { nullable: true })
  property?: ConnectedEntity

  @Field(() => [ConnectedEntity], { nullable: true })
  incident?: ConnectedEntity

  @Field()
  isTemplate: boolean

  @Field(() => [ReportSection])
  sections: ReportSection[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}