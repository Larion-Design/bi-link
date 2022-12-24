import { Field, ObjectType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { ConnectedEntity } from '../../common/dto/connectedEntity'
import { AssociateAPIOutput } from 'defs'

@ObjectType()
export class Associate implements AssociateAPIOutput {
  @Field()
  role: string

  @Field(() => ConnectedEntity, { nullable: true })
  person?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  company?: ConnectedEntity

  @Field({ nullable: true })
  startDate: Date | null

  @Field({ nullable: true })
  endDate: Date | null

  @Field()
  equity: number

  @Field()
  isActive: boolean

  @Field(() => [CustomField], { nullable: true })
  customFields: CustomField[]

  @Field({ nullable: true, defaultValue: true })
  _confirmed: boolean
}
