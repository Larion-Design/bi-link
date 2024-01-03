import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { EducationAPIOutput } from 'defs'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class Education
  extends PickType(WithMetadata, ['metadata'] as const)
  implements EducationAPIOutput
{
  @Field(() => ID, { nullable: true })
  _id?: string

  @Field()
  type: string

  @Field()
  school: string

  @Field()
  specialization: string

  @Field(() => ConnectedEntity, { nullable: true })
  company?: ConnectedEntity

  @Field(() => Date, { nullable: true })
  startDate: Date | string | null

  @Field(() => Date, { nullable: true })
  endDate: Date | string | null
}
