import { Field, InputType, PickType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { AssociateAPI } from 'defs'
import { BooleanValueInput } from '../../generic/dto/booleanValueInput'
import { NumberValueInput } from '../../generic/dto/numberValueInput'
import { OptionalDateValueInput } from '../../generic/dto/optionalDateValueInput'
import { TextValueInput } from '../../generic/dto/textValueInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class AssociateInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements AssociateAPI
{
  @Field(() => TextValueInput)
  readonly role: TextValueInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly person?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  readonly company?: ConnectedEntityInput

  @Field(() => OptionalDateValueInput)
  readonly startDate: OptionalDateValueInput

  @Field(() => OptionalDateValueInput)
  readonly endDate: OptionalDateValueInput

  @Field(() => BooleanValueInput)
  readonly isActive: BooleanValueInput

  @Field(() => NumberValueInput)
  readonly equity: NumberValueInput

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]
}
