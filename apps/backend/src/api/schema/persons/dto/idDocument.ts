import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { IdDocumentAPI, IdDocumentStatus } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class IdDocument
  extends PickType(WithMetadata, ['metadata'] as const)
  implements IdDocumentAPI
{
  @Field(() => ID, { nullable: true })
  _id?: string

  @Field()
  documentType: string

  @Field()
  documentNumber: string

  @Field({ nullable: true })
  issueDate?: Date

  @Field({ nullable: true })
  expirationDate?: Date

  @Field(() => String)
  status: IdDocumentStatus
}
