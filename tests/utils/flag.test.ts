import { describe, it, expect } from 'vitest'
import { getFlag } from '../../utils/flag'

describe('getFlag', () => {
  it('returns emoji for valid country codes', () => {
    expect(getFlag('US')).toBe('🇺🇸')
    expect(getFlag('DE')).toBe('🇩🇪')
    expect(getFlag('CN')).toBe('🇨🇳')
  })

  it('returns undefined for invalid input', () => {
    // empty string and lower case
    expect(getFlag('')).toBeUndefined()
    expect(getFlag('us')).toBeUndefined()
    // too many letters
    expect(getFlag('USA')).toBeUndefined()
    // contains numbers
    expect(getFlag('1A')).toBeUndefined()
  })
})
