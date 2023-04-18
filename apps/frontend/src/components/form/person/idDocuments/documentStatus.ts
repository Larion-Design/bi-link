import { IdDocumentStatus } from 'defs'

export const DocumentStatusSelectOptions: Record<IdDocumentStatus, string> = {
  VALID: 'Valid',
  EXPIRED: 'Expirat',
  LOST_OR_STOLEN: 'Pierdut sau furat',
}
