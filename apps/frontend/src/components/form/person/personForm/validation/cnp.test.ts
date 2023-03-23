import { describe, expect, it } from 'vitest'

import { validateCNPFormat } from './cnp'

describe('validateCNPFormat', () => {
  it('should validate CNP correctly', () => {
    expect(validateCNPFormat('1920509589130')).toEqual('Numărul CNP este invalid.')
  })
})
