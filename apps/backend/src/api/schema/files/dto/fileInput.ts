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

  @Field({ nullable: true, defaultValue: '' })
  readonly name: string

  @Field({ nullable: true, defaultValue: '' })
  readonly description: string

  @Field({ nullable: true, defaultValue: false })
  readonly isHidden: boolean

  @Field({ nullable: true, defaultValue: '' })
  readonly hash: string

  @Field({ nullable: true })
  readonly mimeType?: string

  @Field({ defaultValue: '' })
  readonly category: string

  @Field(() => [String], { nullable: true, defaultValue: [] })
  readonly tags: string[]
}
