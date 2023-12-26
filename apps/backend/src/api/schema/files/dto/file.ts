import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { DownloadUrl } from './downloadUrl'
import { FileAPIOutput } from 'defs'

@ObjectType()
export class File extends PickType(WithMetadata, ['metadata'] as const) implements FileAPIOutput {
  @Field(() => ID)
  fileId: string

  @Field()
  mimeType: string

  @Field(() => DownloadUrl)
  url?: DownloadUrl

  @Field({ nullable: true, defaultValue: '' })
  name: string

  @Field({ nullable: true, defaultValue: '' })
  description: string

  @Field()
  isHidden: boolean

  @Field()
  category: string

  @Field(() => [String])
  tags: string[]
}
