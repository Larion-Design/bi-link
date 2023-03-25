import { Field, ObjectType } from '@nestjs/graphql'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { DownloadUrl } from './downloadUrl'
import { FileAPIOutput } from 'defs'

@ObjectType({ implements: () => [WithMetadata] })
export class File implements WithMetadata, FileAPIOutput {
  metadata: Metadata

  @Field()
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
}
