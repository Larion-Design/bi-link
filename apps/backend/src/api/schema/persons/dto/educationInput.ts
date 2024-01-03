import { Field, ID, InputType, PickType } from '@nestjs/graphql'
import { EducationAPIInput } from 'defs'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class EducationInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements EducationAPIInput
{
  @Field(() => ID, { nullable: true })
  _id?: string

  @Field()
  type: string

  @Field()
  school: string

  @Field()
  specialization: string

  @Field(() => ConnectedEntityInput, { nullable: true })
  company?: ConnectedEntityInput

  @Field(() => Date, { nullable: true })
  startDate: Date | null

  @Field(() => Date, { nullable: true })
  endDate: Date | null
}
