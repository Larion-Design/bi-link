import { Field, InputType } from '@nestjs/graphql'
import { Length, Max, Min } from 'class-validator'
import { ConnectedEntityInput } from '../../common/dto/connectedEntityInput'
import { RelationshipAPIInput } from 'defs'

@InputType()
export class RelationshipInput implements RelationshipAPIInput {
  @Field()
  readonly description: string

  @Length(1, 30)
  @Field()
  readonly type: string

  @Min(1)
  @Max(5)
  @Field()
  readonly proximity: number

  @Field(() => ConnectedEntityInput)
  readonly person: ConnectedEntityInput

  @Field(() => [ConnectedEntityInput])
  readonly relatedPersons: ConnectedEntityInput[]

  @Field({ nullable: true, defaultValue: true })
  readonly _confirmed: boolean
}
