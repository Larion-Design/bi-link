import { Field, InputType, PickType } from '@nestjs/graphql'
import { IdDocumentAPI, IdDocumentStatus } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class IdDocumentInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements IdDocumentAPI
{
  @Field()
  readonly documentType: string

  @Field()
  readonly documentNumber: string

  @Field({ nullable: true })
  readonly issueDate?: Date

  @Field({ nullable: true })
  readonly expirationDate?: Date

  @Field(() => String)
  readonly status: IdDocumentStatus
}
