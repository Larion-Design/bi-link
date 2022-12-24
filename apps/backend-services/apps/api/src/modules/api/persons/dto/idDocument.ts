import { Field, ObjectType } from '@nestjs/graphql'
import { IdDocumentAPI, IdDocumentStatus } from 'defs'

@ObjectType()
export class IdDocument implements IdDocumentAPI {
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
