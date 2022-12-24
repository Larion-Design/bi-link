import { Field, ObjectType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { Party } from './party'
import { IncidentAPIOutput } from 'defs'

@ObjectType()
export class Incident implements IncidentAPIOutput {
  @Field()
  _id: string

  @Field()
  date: Date

  @Field()
  type: string

  @Field()
  location: string

  @Field({ nullable: true })
  description: string

  @Field(() => [Party])
  parties: Party[]

  @Field(() => [CustomField], { nullable: true })
  customFields: CustomField[]

  @Field(() => [File], { nullable: true })
  files: File[]
}
