import { Field, ID, InputType, PickType } from '@nestjs/graphql'
import { FileAPIInput } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class FileInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements FileAPIInput
{
  @Field(() => ID)
  readonly fileId: string

  @Field({ nullable: true })
  readonly name: string

  @Field({ nullable: true })
  readonly description: string

  @Field()
  readonly isHidden: boolean

  @Field()
  readonly category: string

  @Field(() => [String])
  readonly tags: string[]
}
