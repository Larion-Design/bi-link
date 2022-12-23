import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { Length } from 'class-validator'
import { ConnectedEntityInput } from '../../common/dto/connectedEntityInput'
import { AssociateAPIInput } from '@app/definitions/associate'

@InputType()
export class AssociateInput implements AssociateAPIInput {
  @Length(1, 30)
  @Field()
  readonly role: string

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly person?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly company?: ConnectedEntityInput

  @Field({ nullable: true })
  readonly startDate?: Date

  @Field({ nullable: true })
  readonly endDate?: Date

  @Field({ nullable: true, defaultValue: false })
  readonly isActive: boolean

  @Field()
  readonly equity: number

  @Field(() => [CustomFieldInput], { nullable: true })
  readonly customFields: CustomFieldInput[]

  @Field({ nullable: true, defaultValue: true })
  readonly _confirmed: boolean
}
