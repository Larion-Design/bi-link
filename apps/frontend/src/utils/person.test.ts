import { getDefaultMetadata } from 'tools'
import { describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { getPersonFullName } from './person'
import { PersonAPIOutput } from 'defs'

describe('getPersonFullName', () => {
  it('should display full name correctly', () => {
    const metadata = getDefaultMetadata()
    const data: Partial<PersonAPIOutput> = {
      firstName: { value: faker.name.firstName(), metadata },
      lastName: { value: faker.name.firstName(), metadata },
    }

    const fullName = getPersonFullName(data)
    expect(fullName).toContain(data.firstName)
    expect(fullName).toContain(data.lastName)
  })
})
