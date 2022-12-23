import { describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { getPersonFullName } from './person'
import { PersonListRecord } from '../types/person'

describe('getPersonFullName', () => {
  it('should display full name correctly', () => {
    const data: PersonListRecord = {
      _id: faker.datatype.uuid(),
      cnp: faker.random.numeric(13),
      firstName: faker.name.firstName(),
      lastName: faker.name.firstName(),
    }

    const fullName = getPersonFullName(data)
    expect(fullName).toContain(data.firstName)
    expect(fullName).toContain(data.lastName)
  })
})
