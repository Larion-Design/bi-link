import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

import { validatePersonRelationshipsFormat } from './validation'

describe('validatePersonRelationshipsFormat', () => {
  it('should return error message', () => {
    const relationships = [
      {
        personId: faker.random.alphaNumeric(),
        type: faker.random.alphaNumeric(),
      },
      {
        personId: faker.random.alphaNumeric(),
      },
    ]

    expect(validatePersonRelationshipsFormat(relationships)).toEqual(
      'Nu ai furnizat unele informatii obligatorii.',
    )
  })
})
