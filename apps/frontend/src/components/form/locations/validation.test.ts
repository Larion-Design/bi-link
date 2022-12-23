import { describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { validateLocationsStructure } from './validation'

describe('validateLocationsStructure', () => {
  it('should validate locations correctly', () => {
    const locations: string[] = [
      faker.address.streetAddress(true),
      faker.address.streetAddress(true),
      faker.address.streetAddress(true),
    ]

    expect(validateLocationsStructure(locations)).toBe(undefined)
    expect(validateLocationsStructure([])).toBe(undefined)
  })

  it('should return error when locations structure is invalid', () => {
    expect(validateLocationsStructure(null)).toBe(
      'Adresa unuia din punctele de lucru este prea scurta.',
    )
  })
})
