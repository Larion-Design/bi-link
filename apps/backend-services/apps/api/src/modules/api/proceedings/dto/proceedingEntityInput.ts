import { Field, InputType } from '@nestjs/graphql'
import { ProceedingEntityInvolvedAPI } from 'defs'
import { ConnectedEntityInput } from '../../common/dto/connectedEntityInput'

@InputType()
export class ProceedingEntityInput implements ProceedingEntityInvolvedAPI {
  @Field(() => ConnectedEntityInput, { nullable: true })
  person: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  company?: ConnectedEntityInput

  @Field()
  description: string

  @Field()
  involvedAs: string
}
