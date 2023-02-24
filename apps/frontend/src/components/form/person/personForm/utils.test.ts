import { describe, expect, it } from 'vitest'

import { getBirthdateFromCnp } from './utils'

describe('getBirthdateFromCnp', () => {
  it('should return birthdate: 1972/04/30', () => {
    const date = getBirthdateFromCnp('1720430400011')
    expect(date).toBeInstanceOf(Date)
    expect(date?.getFullYear()).toEqual(1972)
    expect(date?.getMonth()).toEqual(3)
    expect(date?.getDate()).toEqual(30)
  })
})
