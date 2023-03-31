import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { EducationAPIOutput } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class Education
  extends PickType(WithMetadata, ['metadata'] as const)
  implements EducationAPIOutput
{
  @Field()
  type: string

  @Field()
  school: string

  @Field()
  specialization: string

  @Field(() => Date, { nullable: true })
  startDate: Date | string | null

  @Field(() => Date, { nullable: true })
  endDate: Date | string | null
}
