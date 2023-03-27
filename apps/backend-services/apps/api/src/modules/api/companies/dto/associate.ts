import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { AssociateAPI } from 'defs'
import { BooleanValue } from '../../generic/dto/booleanValue'
import { NumberValue } from '../../generic/dto/numberValue'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
import { TextValue } from '../../generic/dto/textValue'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class Associate
  extends PickType(WithMetadata, ['metadata'] as const)
  implements AssociateAPI
{
  @Field(() => TextValue)
  role: TextValue

  @Field(() => ConnectedEntity, { nullable: true })
  person?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  company?: ConnectedEntity

  @Field(() => OptionalDateValue)
  startDate: OptionalDateValue

  @Field(() => OptionalDateValue)
  endDate: OptionalDateValue

  @Field(() => NumberValue)
  equity: NumberValue

  @Field(() => BooleanValue)
  isActive: BooleanValue

  @Field(() => [CustomField])
  customFields: CustomField[]
}
