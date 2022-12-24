import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

import { validateEmailFields, validatePhoneNumberFields } from './validation'
import { CustomField } from 'defs'

describe('validateDuplicateContactDetails', () => {
  it('should validate emails correctly', () => {
    const contactDetails: CustomField[] = [
      {
        fieldName: 'Email',
        fieldValue: faker.internet.email(),
      },
    ]

    expect(validateEmailFields(contactDetails)).toEqual(undefined)
  })

  it('should validate phone numbers correctly', () => {
    const contactDetails: CustomField[] = [
      {
        fieldName: 'Telefon',
        fieldValue: faker.phone.number('+40 7# ### ## ##'),
      },
    ]

    expect(validatePhoneNumberFields(contactDetails)).toEqual(undefined)
  })
})
