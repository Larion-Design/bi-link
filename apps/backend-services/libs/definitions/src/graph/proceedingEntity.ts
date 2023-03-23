import { RelationshipMetadata } from 'defs'
import { ProceedingEntity } from '../../../../apps/api/src/modules/api/proceedings/dto/proceedingEntity'

export interface ProceedingEntityRelationship
  extends RelationshipMetadata,
    Pick<ProceedingEntity, 'involvedAs'> {}
