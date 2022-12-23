import { describe, expect, it } from 'vitest'
import { validateDocumentDates } from './validation'
import { IdDocument, IdDocumentStatus } from '../../../types/idDocument'

describe('validateDocumentDates', () => {
  it('should return error message', () => {
    const documents: IdDocument[] = [
      {
        documentType: 'Pasaport',
        documentNumber: '12345678',
        issueDate: new Date('1994-07-30'),
        expirationDate: new Date('1990-07-30'),
        status: IdDocumentStatus.VALID,
      },
    ]

    expect(validateDocumentDates(documents)).toEqual(
      'Data emiterii actului de identitate este mai recenta decat data expirarii.',
    )
  })

  it('should validate documents correctly', () => {
    const documents: IdDocument[] = [
      {
        documentType: 'Pasaport',
        documentNumber: '12345678',
        issueDate: new Date('1990-07-30'),
        expirationDate: new Date('1994-07-30'),
        status: IdDocumentStatus.VALID,
      },
    ]

    expect(validateDocumentDates(documents)).toEqual(undefined)
  })
})
