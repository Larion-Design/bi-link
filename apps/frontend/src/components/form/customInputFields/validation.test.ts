import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

import { validateCustomFieldsFormat, validateDuplicateCustomFields } from './validation'
import { CustomField } from 'defs'

describe('validateDuplicateCustomFields', () => {
  it('should return error message', () => {
    const jobType = faker.name.jobType()
    const jobTitle = faker.name.jobTitle()

    const customFields: CustomField[] = [
      {
        fieldName: jobType,
        fieldValue: jobTitle,
      },
      {
        fieldName: jobType,
        fieldValue: jobTitle,
      },

      {
        fieldName: faker.company.bs(),
        fieldValue: faker.company.name(),
      },
    ]

    expect(validateDuplicateCustomFields(customFields)).toContain(
      'Ai introdus aceeași valoare de mai multe ori',
    )
  })

  it('should validate custom fields correctly', () => {
    const customFields: CustomField[] = [
      {
        fieldName: faker.finance.accountName(),
        fieldValue: faker.finance.account(),
      },
    ]

    expect(validateDuplicateCustomFields(customFields)).toEqual(undefined)
  })
})

describe('validateDuplicateCustomFields', () => {
  it('should return error message', async () => {
    const customFields = [
      {
        fieldName: faker.finance.accountName(),
        fieldValue: faker.finance.account(),
      },
      {
        fieldName: faker.commerce.product(),
      },
    ]

    expect(await validateCustomFieldsFormat(customFields)).toEqual(
      'Nu ai furnizat unele informatii obligatorii.',
    )
  })
})
