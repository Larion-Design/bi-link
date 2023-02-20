import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { Length } from 'class-validator'
import { ConnectedEntityInput } from '../../common/dto/connectedEntityInput'
import { AssociateAPIInput } from 'defs'

@InputType()
export class AssociateInput implements AssociateAPIInput {
  @Length(1, 50)
  @Field()
  readonly role: string

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly person?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly company?: ConnectedEntityInput

  @Field({ nullable: true })
  readonly startDate: Date | null

  @Field({ nullable: true })
  readonly endDate: Date | null

  @Field()
  readonly isActive: boolean

  @Field()
  readonly equity: number

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]

  @Field({ nullable: true, defaultValue: true })
  readonly _confirmed: boolean
}
